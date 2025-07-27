import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { UpdateInternshipDto } from './dto/update-internship.dto';
import { Prisma } from '@prisma/client';
import { CategoryService } from '../category/category.service';
import { TagService } from '../tag/tag.service';

@Injectable()
export class InternshipService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
    private tagService: TagService,
  ) {}

  async create(createInternshipDto: CreateInternshipDto) {
    const existingInternship = await this.prisma.internship.findUnique({
      where: {
        name: createInternshipDto.name,
      },
      select: { uuid: true },
    });
    if (existingInternship) {
      throw new ConflictException('Internship with this name already exists');
    }

    const {
      tags: tagNames,
      category: categoryName,
      ...internshipData
    } = createInternshipDto;

    const [category, tags] = await Promise.all([
      this.categoryService.findOrCreate(categoryName),
      Promise.all(
        tagNames.map((tagName) => this.tagService.findOrCreate(tagName)),
      ),
    ]);

    return this.prisma.internship.create({
      data: {
        ...internshipData,
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
  }

  async findOne(uuid: string) {
    const internship = await this.prisma.internship.findUnique({
      where: { uuid },
      include: {
        category: true,
        tags: true,
        Request: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!internship) {
      throw new NotFoundException(`Internship with uuid ${uuid} not found`);
    }

    return internship;
  }

  async findByCategory(categoryName: string) {
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

  async update(uuid: string, updateInternshipDto: UpdateInternshipDto) {
    const currentInternship = await this.prisma.internship.findUnique({
      where: { uuid },
      include: { tags: true },
    });

    if (!currentInternship) {
      throw new NotFoundException(`Internship with uuid ${uuid} not found`);
    }

    const {
      category: categoryName,
      tags: tagNames = [],
      ...internshipData
    } = updateInternshipDto;

    const dataToUpdate: Prisma.InternshipUpdateInput = {
      ...internshipData,
    };

    const [category, tags] = await Promise.all([
      categoryName ? this.categoryService.findOrCreate(categoryName) : null,
      Promise.all(
        (tagNames || []).map((tagName) =>
          this.tagService.findOrCreate(tagName),
        ),
      ),
    ]);

    if (category) {
      dataToUpdate.category = {
        connect: { uuid: category.uuid },
      };
    }
    if (tags.length > 0) {
      dataToUpdate.tags = {
        set: tags.map((tag) => ({ uuid: tag.uuid })),
      };
    }

    return this.prisma.internship.update({
      where: { uuid },
      data: dataToUpdate,
      include: {
        category: true,
        tags: true,
      },
    });
  }

  async remove(uuid: string) {
    const internship = await this.prisma.internship.findUnique({
      where: { uuid },
    });
    if (!internship) {
      throw new NotFoundException(`Internship with uuid ${uuid} not found`);
    }

    await this.prisma.internship.delete({ where: { uuid } });
  }
}
