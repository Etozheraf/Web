import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        Request: {
          include: {
            internship: true
          }
        }
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        Request: {
          include: {
            internship: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });
  }

  async findByName(name: string) {
    return this.prisma.user.findFirst({
      where: { name },
      include: {
        Request: {
          include: {
            internship: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}
