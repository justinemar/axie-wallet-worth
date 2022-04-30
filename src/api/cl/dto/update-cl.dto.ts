import { PartialType } from '@nestjs/mapped-types';
import { CreateClDto } from './create-cl.dto';

export class UpdateClDto extends PartialType(CreateClDto) {}
