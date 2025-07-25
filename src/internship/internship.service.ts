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
      select: { id: true },
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
          connect: { id: category.id },
        },
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
        },
      },
      include: {
        category: true,
        tags: true,
      },
    });
  }

  async findOne(id: number) {
    const internship = await this.prisma.internship.findUnique({
      where: { id },
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
      throw new NotFoundException(`Internship with ID ${id} not found`);
    }

    return internship;
  }

  async findByCategory(categoryName: string) {
    const category = await this.prisma.category.findUnique({
      where: { name: categoryName },
      select: { id: true },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with name ${categoryName} not found`,
      );
    }

    return this.prisma.internship.findMany({
      where: {
        category: {
          name: categoryName,
        },
      },
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async update(id: number, updateInternshipDto: UpdateInternshipDto) {
    const currentInternship = await this.prisma.internship.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!currentInternship) {
      throw new NotFoundException(`Internship with ID ${id} not found`);
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
        connect: { id: category.id },
      };
    }
    if (tags.length > 0) {
      dataToUpdate.tags = {
        set: tags.map((tag) => ({ id: tag.id })),
      };
    }

    return this.prisma.internship.update({
      where: { id },
      data: dataToUpdate,
      include: {
        category: true,
        tags: true,
      },
    });
  }

  async remove(id: number) {
    const internship = await this.prisma.internship.findUnique({
      where: { id },
    });
    if (!internship) {
      throw new NotFoundException(`Internship with id ${id} not found`);
    }

    await this.prisma.internship.delete({ where: { id } });
  }
}
