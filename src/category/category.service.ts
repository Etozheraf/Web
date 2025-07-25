import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { CreateCategoryDto } from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

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

  findOne(/*id: number*/) {
    throw new NotImplementedException();
  }

  update(/*id: number, updateCategoryDto: UpdateCategoryDto*/) {
    throw new NotImplementedException();
  }

  remove(/*id: number*/) {
    throw new NotImplementedException();
  }
}
