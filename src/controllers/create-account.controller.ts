import {
  Controller,
  Post,
  HttpCode,
  Body,
  ConflictException,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { hash } from 'bcryptjs';
import { createZodDto } from 'nestjs-zod';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

class CreateAccountDTO extends createZodDto(createAccountBodySchema) {}

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user account' })
  async handle(@Body() body: CreateAccountDTO) {
    const { name, email, password } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists.',
      );
    }

    const hashedPassword = await hash(password, 8);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}
