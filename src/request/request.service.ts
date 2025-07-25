import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  async create(createRequestDto: CreateRequestDto) {
    const request = await this.prisma.request.create({
      data: {
        name: createRequestDto.name,
        status: createRequestDto.status,
        date: createRequestDto.dates,

        userId: createRequestDto.userId,
        internshipId: createRequestDto.internshipId,
      },
      include: {
        internship: true,
        user: true,
      },
    });

    return request;
  }

  async findByUser(userId: number) {
    return this.prisma.request.findMany({
      where: { userId },
      include: {
        internship: true,
        user: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async remove(id: number) {
    return this.prisma.request.delete({
      where: { id },
    });
  }
}
