import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsOptional()
  @IsNumber()
  reply_id: number;

  @IsNotEmpty()
  @IsString()
  comment: string;
}