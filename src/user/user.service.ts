import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findOne(uuid: string) {
    const user = await this.prisma.user.findUnique({
      where: { uuid },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${uuid} not found`);
    }
    return user;
  }

  async findByAuthId(authId: string) {
    const user = await this.prisma.user.findUnique({
      where: { authId },
    });
    if (!user) {
      throw new NotFoundException(`User with authId ${authId} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(uuid: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { uuid },
      data: updateUserDto,
    });
  }

  async updateByAuthId(authId: string, updateUserDto: UpdateUserDto) {
    const user = await this.findByAuthId(authId);
    return this.prisma.user.update({
      where: { uuid: user.uuid },
      data: updateUserDto,
    });
  }

  async remove(uuid: string) {
    return this.prisma.user.delete({
      where: { uuid },
    });
  }

  async removeByAuthId(authId: string) {
    const user = await this.findByAuthId(authId);
    return this.prisma.user.delete({
      where: { uuid: user.uuid },
    });
  }
}

