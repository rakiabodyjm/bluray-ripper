import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/user.entity';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  findAll() {
    return this.appService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: Omit<User, 'id'>) {
    return this.appService.create(createUserDto);
  }
}
