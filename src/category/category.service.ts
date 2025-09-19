import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: createCategoryDto.name },
    });
    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }
    const newCategory = await this.prisma.category.create({
      data: createCategoryDto,
    });
    await this.cacheManager.del('categories:all');
    return newCategory;
  }

  async findOrCreate(name: string) {
    let category = await this.prisma.category.findUnique({
      where: { name: name },
    });

    if (!category) {
      category = await this.prisma.category.create({
        data: { name: name },
      });
      await this.cacheManager.del('categories:all');
    }
    return category;
  }

  async findAll(): Promise<Category[]> {
    const cachedCategories =
      await this.cacheManager.get<Category[]>('categories:all');
    if (cachedCategories) {
      return cachedCategories;
    }

    const categories = await this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    await this.cacheManager.set('categories:all', categories);
    return categories;
  }

  async findOne(uuid: string): Promise<Category> {
    const cacheKey = `category:${uuid}`;
    const cachedCategory = await this.cacheManager.get<Category>(cacheKey);
    if (cachedCategory) {
      return cachedCategory;
    }

    const category = await this.prisma.category.findUnique({
      where: { uuid },
    });

    if (!category) {
      throw new NotFoundException(`Category with uuid ${uuid} not found`);
    }
    await this.cacheManager.set(cacheKey, category);
    return category;
  }

  async update(uuid: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(uuid);
    const updatedCategory = await this.prisma.category.update({
      where: { uuid },
      data: updateCategoryDto,
    });

    await this.cacheManager.del('categories:all');
    await this.cacheManager.del(`category:${uuid}`);
    return updatedCategory;
  }

  async remove(uuid: string) {
    await this.findOne(uuid);
    await this.prisma.category.delete({
      where: { uuid },
    });
    await this.cacheManager.del('categories:all');
    await this.cacheManager.del(`category:${uuid}`);
  }
}