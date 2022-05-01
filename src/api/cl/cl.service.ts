import { QueriesService } from '@mavis/queries';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { map } from 'rxjs';
import { CreateClDto } from './dto/create-cl.dto';
import { UpdateClDto } from './dto/update-cl.dto';

@Injectable()
export class ClService {
  constructor(private mavis: QueriesService) {}

  create(createClDto: CreateClDto) {
    return 'This action adds a new cl';
  }

  async findAll(roninAddress: string) {
    // return roninAddress;

     return await this.mavis.getAxieList(roninAddress);
  }

  async findOne(roninAddress: string) {
    return await this.mavis.refreshAxies(roninAddress);
  }

  update(id: number, updateClDto: UpdateClDto) {
    return `This action updates a #${id} cl`;
  }

  remove(id: number) {
    return `This action removes a #${id} cl`;
  }
}
