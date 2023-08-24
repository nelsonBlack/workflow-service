import { Body, Controller, Get, Param, Post, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from '../_common/dtos/create-card.dto';
import { UpdateCardDto } from '../_common/dtos/update-card.dto';
import { AuthGuard } from 'src/_common/security/auth.guard';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  //카드 조회
  @Get()
  async GetCards(@Query('board_column_Id') board_column_Id: number) {
    return await this.cardsService.GetCards(board_column_Id);
  }

  //카드 상세 조회
  @Get('/:cardId')
  async GetCardById(@Query('board_column_Id') board_column_Id: number, @Param('cardId') id: number) {
    return await this.cardsService.GetCardById(board_column_Id, id);
  }

  //카드 생성
  @Post()
  @UseGuards(AuthGuard)
  async CreateCard(@Query('board_column_Id') board_column_Id: number, @Body() data: CreateCardDto) {
    await this.cardsService.CreateCard(
      board_column_Id,
      data.name,
      data.content,
      data.file_url,
      data.sequence,
      data.color,
      data.members
    );
  }

  //카드 수정
  @Patch('/:cardId')
  @UseGuards(AuthGuard)
  async UpdateCard(
    @Query('board_column_Id') board_column_Id: number,
    @Param('cardId') id: number,
    @Body() data: UpdateCardDto
  ) {
    return await this.cardsService.UpdateCard(
      board_column_Id,
      id,
      data.name,
      data.content,
      data.file_url,
      data.sequence
    );
  }

  //카드 삭제
  @Delete('/:cardId')
  @UseGuards(AuthGuard)
  async DeleteCard(@Query('board_column_Id') columnId: number, @Param('cardId') id: number) {
    return await this.cardsService.DeleteCard(columnId, id);
  }
}
