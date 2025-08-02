import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInternshipInput } from './dto/create-internship.input';
import { UpdateInternshipInput } from './dto/update-internship.input';
import { Internship } from './entities/internship.entity';
import { Prisma } from '@prisma/client';
import { CategoryService } from '../category/category.service';
import { TagService } from '../tag/tag.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class InternshipService {
  private eventsSubject = new Subject<{
    type: string;
    internship: Internship;
  }>();

  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
    private tagService: TagService,
  ) {}

  getEventsStream(): Observable<{ type: string; internship: Internship }> {
    return this.eventsSubject.asObservable();
  }

  async create(input: CreateInternshipInput) {
    const category = await this.categoryService.findOrCreate(
      input.categoryName,
    );

    const existingInternship = await this.prisma.internship.findUnique({
      where: {
        name_categoryUuid: {
          name: input.name,
          categoryUuid: category.uuid,
        },
      },
      select: { uuid: true },
    });
    if (existingInternship) {
      throw new ConflictException('Internship already exists');
    }

    let { tags: tagNames, categoryName, ...internshipData } = input;

    if (!tagNames) {
      tagNames = [];
    }

    const tags = await Promise.all(
      tagNames.map((tagName) => this.tagService.findOrCreate(tagName)),
    );

    const internship = await this.prisma.internship.create({
      data: {
        ...internshipData,
        date: internshipData.date,
        imgUrl: internshipData.imgUrl,
        category: {
          connect: { uuid: category.uuid },
        },
        tags: {
          connect: tags.map((tag) => ({ uuid: tag.uuid })),
        },
      },
      include: {
        category: true,
        tags: true,
      },
    });

    this.eventsSubject.next({ type: 'created', internship });

    return internship;
  }

  async findOne(uuid: string) {
    const internship = await this.prisma.internship.findUnique({
      where: { uuid },
      include: {
        category: true,
        tags: true,
      },
    });

    if (!internship) {
      throw new NotFoundException(`Internship with uuid ${uuid} not found`);
    }

    return internship;
  }

  async findByCategory(categoryName: string) {
    if (!categoryName) {
      throw new BadRequestException(
        'Category is required for finding internships',
      );
    }
    const category = await this.prisma.category.findUnique({
      where: { name: categoryName },
      select: { uuid: true },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with name ${categoryName} not found`,
      );
    }

    const internships = await this.prisma.internship.findMany({
      where: {
        categoryUuid: category.uuid,
      },
      include: {
        category: true,
        tags: true,
      },
    });

    internships.sort((a, b) => {
      if (a.closed !== b.closed) {
        return a.closed ? 1 : -1;
      }

      const aHasDate = a.date && a.date.trim() !== '';
      const bHasDate = b.date && b.date.trim() !== '';
      if (aHasDate !== bHasDate) {
        return aHasDate ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });

    return internships;
  }

  async findByNameAndCategory(name: string, categoryName: string) {
    const category = await this.prisma.category.findUnique({
      where: { name: categoryName },
    });

    if (!category) {
      return null;
    }

    return this.prisma.internship.findUnique({
      where: {
        name_categoryUuid: {
          name: name,
          categoryUuid: category.uuid,
        },
      },
      include: {
        category: true,
        tags: true,
      },
    });
  }

  async update(uuid: string, input: UpdateInternshipInput) {
    const currentInternship = await this.prisma.internship.findUnique({
      where: { uuid },
      include: {
        category: true,
      },
    });

    if (!currentInternship) {
      throw new NotFoundException(`Internship with uuid ${uuid} not found`);
    }

    const { categoryName, tags: rawTags, ...internshipData } = input;

    const dataToUpdate: Prisma.InternshipUpdateInput = {
      ...internshipData,
    };

    const [category, tags] = await Promise.all([
      categoryName ? this.categoryService.findOrCreate(categoryName) : null,
      rawTags !== undefined
        ? Promise.all(
            rawTags.map((tagName) => this.tagService.findOrCreate(tagName)),
          )
        : null,
    ]);

    if (category) {
      dataToUpdate.category = {
        connect: { uuid: category.uuid },
      };
    }

    if (rawTags !== undefined) {
      dataToUpdate.tags = {
        set: tags?.map((tag) => ({ uuid: tag.uuid })) ?? [],
      };
    }

    const updatedInternship = await this.prisma.internship.update({
      where: { uuid },
      data: dataToUpdate,
      include: {
        category: true,
        tags: true,
      },
    });

    this.eventsSubject.next({ type: 'updated', internship: updatedInternship });

    return updatedInternship;
  }

  async remove(uuid: string) {
    const internship = await this.prisma.internship.findUnique({
      where: { uuid },
      include: {
        category: true,
        tags: true,
      },
    });
    if (!internship) {
      throw new NotFoundException(`Internship with uuid ${uuid} not found`);
    }

    await this.prisma.internship.delete({ where: { uuid } });

    this.eventsSubject.next({ type: 'deleted', internship });
  }
}
