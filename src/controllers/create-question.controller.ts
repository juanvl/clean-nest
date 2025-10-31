import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { type UserPayload } from 'src/auth/jwt.strategy';

@Controller('/questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor() {}

  @Post()
  handle(@CurrentUser() user: UserPayload) {
    console.log(user.sub);
    return 'ok';
  }
}
