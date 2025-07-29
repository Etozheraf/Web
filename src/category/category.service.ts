import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    if (!createCategoryDto.name) {
      throw new ConflictException('Category name is required');
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
    const category = await this.findOne(uuid);
    
    return this.prisma.category.update({
      where: { uuid },
      data: updateCategoryDto,
    });
  }

  async remove(uuid: string) {
    const category = await this.prisma.category.findUnique({
      where: { uuid },
    });
    if (!category) {
      throw new NotFoundException(`Category with uuid ${uuid} not found`);
    }
    
    return this.prisma.category.delete({
      where: { uuid },
    });
  }
}
