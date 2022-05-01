import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Request } from 'express';
import { ClService } from './cl.service';
import { CreateClDto } from './dto/create-cl.dto';
import { UpdateClDto } from './dto/update-cl.dto';

@Controller('mavis')
export class ClController {
  constructor(private readonly clService: ClService) {}

  @Post()
  create(@Body() createClDto: CreateClDto) {
    return this.clService.create(createClDto);
  }
s
  @Get('axies/:address')
  async findAll(@Param('address') roninAddress) {
    return await this.clService.findAll(roninAddress);
  }

  @Get('axies/:address/refresh')
  findOne(@Param('address') roninAddress: string) {
    return this.clService.findOne(roninAddress);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClDto: UpdateClDto) {
    return this.clService.update(+id, updateClDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clService.remove(+id);
  }
}
