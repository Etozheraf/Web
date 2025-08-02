import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    const existingTag = await this.prisma.tag.findUnique({
      where: { name: createTagDto.name },
    });
    if (existingTag) {
      throw new ConflictException('Tag already exists');
    }
    return this.prisma.tag.create({
      data: createTagDto,
    });
  }

  async findOrCreate(name: string) {
    let tag = await this.prisma.tag.findUnique({
      where: { name: name },
    });

    if (!tag) {
      tag = await this.prisma.tag.create({
        data: { name: name },
      });
    }
    return tag;
  }

  async findAll() {
    return this.prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(uuid: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { uuid },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with uuid ${uuid} not found`);
    }

    return tag;
  }

  async update(uuid: string, updateTagDto: UpdateTagDto) {
    await this.findOne(uuid);

    return this.prisma.tag.update({
      where: { uuid },
      data: updateTagDto,
    });
  }

  async remove(uuid: string) {
    const tag = await this.findOne(uuid);

    return this.prisma.tag.delete({
      where: { uuid },
    });
  }
}
