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

        userUuid: createRequestDto.userUuid,
        internshipUuid: createRequestDto.internshipUuid,
      },
      include: {
        internship: true,
        user: true,
      },
    });

    return request;
  }

  async findByUser(userUuid: string) {
    return this.prisma.request.findMany({
      where: { userUuid },
      include: {
        internship: true,
        user: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async remove(uuid: string) {
    return this.prisma.request.delete({
      where: { uuid },
    });
  }
}
