import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { CreateTagDto } from './dto/create-tag.dto';
// import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

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

  findOne(/*id: number*/) {
    throw new NotImplementedException();
  }

  update(/*id: number, updateTagDto: UpdateTagDto*/) {
    throw new NotImplementedException();
  }

  remove(/*id: number*/) {
    throw new NotImplementedException();
  }
}
