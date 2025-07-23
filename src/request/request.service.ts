import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  async create(createRequestDto: CreateRequestDto) {
    const request = await this.prisma.request.create({
      data: {
        internshipId: createRequestDto.internshipId,
        userId: createRequestDto.userId,
        status: createRequestDto.status || 'Active',
        date: createRequestDto.date || new Date().toISOString()
      },
      include: {
        internship: {
          include: {
            category: true
          }
        },
        user: true
      }
    });

    return request;
  }

  async findAll() {
    return this.prisma.request.findMany({
      include: {
        internship: {
          include: {
            category: true
          }
        },
        user: true
      },
      orderBy: {
        date: 'desc'
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.request.findUnique({
      where: { id },
      include: {
        internship: {
          include: {
            category: true
          }
        },
        user: true
      }
    });
  }

  async update(id: number, updateRequestDto: UpdateRequestDto) {
    return this.prisma.request.update({
      where: { id },
      data: updateRequestDto,
      include: {
        internship: {
          include: {
            category: true
          }
        },
        user: true
      }
    });
  }

  async remove(id: number) {
    return this.prisma.request.delete({
      where: { id }
    });
  }

  async getAvailableInternships() {
    return this.prisma.internship.findMany({
      where: {
        closed: false
      },
      include: {
        category: true,
        tags: true
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  async findByUser(userId: number) {
    return this.prisma.request.findMany({
      where: { userId },
      include: {
        internship: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
  }
}
