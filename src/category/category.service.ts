import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: createCategoryDto.name },
    });
    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findOrCreate(name: string) {
    let category = await this.prisma.category.findUnique({
      where: { name: name },
    });

    if (!category) {
      category = await this.prisma.category.create({
        data: { name: name },
      });
    }
    return category;
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(uuid: string) {
    const category = await this.prisma.category.findUnique({
      where: { uuid },
    });
    
    if (!category) {
      throw new NotFoundException(`Category with uuid ${uuid} not found`);
    }
    
    return category;
  }

  async update(uuid: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(uuid);
    
    return this.prisma.category.update({
      where: { uuid },
      data: updateCategoryDto,
    });
  }

  async remove(uuid: string) {
    await this.findOne(uuid);
    
    return this.prisma.category.delete({
      where: { uuid },
    });
  }
}
