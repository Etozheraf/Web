import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, status:  'Active' | 'Closed', dates: string, userUuid: string, internshipUuid: string) {
    const request = await this.prisma.request.create({
      data: {
        name: name,
        status: status,
        date: dates,

        userUuid: userUuid,
        internshipUuid: internshipUuid,
      },
      include: {
        internship: true,
        user: true,
      },
    });

    return request;
  }

  async findOne(uuid: string) {
    const request = await this.prisma.request.findUnique({
      where: { uuid },
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
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
    await this.findOne(uuid);
    return this.prisma.request.delete({
      where: { uuid },
    });
  }
}
