import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { UpdateInternshipDto } from './dto/update-internship.dto';

@Injectable()
export class InternshipService {
  constructor(private prisma: PrismaService) {}

  async create(createInternshipDto: CreateInternshipDto) {
    const { tagIds, ...internshipData } = createInternshipDto;
    
    const internship = await this.prisma.internship.create({
      data: {
        ...internshipData,
        closed: internshipData.closed ?? false,
        tags: tagIds ? {
          connect: tagIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        category: true,
        tags: true
      }
    });

    return internship;
  }

  async findAll() {
    return this.prisma.internship.findMany({
      include: {
        category: true,
        tags: true
      },
      orderBy: {
        date: 'desc'
      }
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
            user: true
          }
        }
      }
    });

    if (!internship) {
      throw new Error(`Internship with ID ${id} not found`);
    }

    return internship;
  }

  async findByCategory(categoryName: string) {
    return this.prisma.internship.findMany({
      where: {
        category: {
          name: categoryName
        }
      },
      include: {
        category: true,
        tags: true
      },
      orderBy: {
        date: 'desc'
      }
    });
  }

  async update(id: number, updateInternshipDto: UpdateInternshipDto) {
    const { tagIds, ...internshipData } = updateInternshipDto;
    
    const internship = await this.prisma.internship.update({
      where: { id },
      data: {
        ...internshipData,
        tags: tagIds ? {
          set: tagIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        category: true,
        tags: true
      }
    });

    return internship;
  }

  async remove(id: number) {
    const internship = await this.prisma.internship.delete({
      where: { id },
      include: {
        category: true,
        tags: true
      }
    });

    return internship;
  }

  async getCategories() {
    return this.prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
  }

  async getTags() {
    return this.prisma.tag.findMany({
      orderBy: {
        name: 'asc'
      }
    });
  }
}
