import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name!: string;
  
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @IsString()
  location!: string;
}
