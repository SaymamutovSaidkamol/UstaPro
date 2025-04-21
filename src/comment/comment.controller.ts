import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryCommentDto } from './dto/comment-query.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

    @UseGuards(AuthGuard)
    @Get('/query')
    @ApiOperation({
      summary: 'Masterlarni qidirish',
      description:
        'Berilgan parametrlar bo‘yicha masterlarni filterlash, sortlash, pagination',
    })
    @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
    @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
    query(@Query() query: QueryCommentDto, @Req() req: Request) {
      return this.commentService.query(query, req);
    }
  
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    return this.commentService.create(createCommentDto, req);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.commentService.findAll(req);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.commentService.findOne(+id, req);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Req() req: Request) {
    return this.commentService.update(+id, updateCommentDto, req);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.commentService.remove(+id, req);
  }
}
