import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import {
  UpdateQueryCommentRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
} from 'src/models/requests';
import { IUserRequest } from 'src/models/requests/user.request';

@ApiTags('Comment')
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get comments with pagination and search' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  async getPagination(@Query() query: UpdateQueryCommentRequest) {
    return await this.commentService.getPagination(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment retrieved successfully' })
  async getById(@Param('id') id: string) {
    return await this.commentService.getById(id);
  }

  @Get('post/:postId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get comments by post ID' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  async getByPostId(@Param('postId') postId: string) {
    return await this.commentService.getByPostId(postId);
  }

  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create new comment' })
  @ApiResponse({ status: 200, description: 'Comment created successfully' })
  async add(
    @Request() req: Request & { user: IUserRequest },
    @Body() model: CreateCommentRequest,
  ) {
    const comment = await this.commentService.update('', {
      ...model,
      userId: req.user.id,
    } as any);

    return comment;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  async update(@Param('id') id: string, @Body() model: UpdateCommentRequest) {
    const comment = await this.commentService.update(id, model);
    return comment;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  async delete(@Param('id') id: string) {
    await this.commentService.delete(id);
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Increment comment like count' })
  @ApiResponse({ status: 200, description: 'Like count incremented' })
  async incrementLike(@Param('id') id: string) {
    await this.commentService.incrementLikes(id);
    return { message: 'Like count incremented' };
  }

  @Post(':id/rating')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update comment rating' })
  @ApiResponse({ status: 200, description: 'Rating updated' })
  async updateRating(
    @Param('id') id: string,
    @Body() body: { rating: number },
  ) {
    await this.commentService.updateRating(id, body.rating);
    return { message: 'Rating updated' };
  }

  @Get(':id/replies')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get replies to a comment' })
  @ApiResponse({ status: 200, description: 'Replies retrieved successfully' })
  async getReplies(@Param('id') id: string) {
    return await this.commentService.getReplies(id);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get comments by user ID' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  async getByUserId(@Param('userId') userId: string) {
    return await this.commentService.getByUserId(userId);
  }

  @Get('post/:postId/with-replies')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get comments with nested replies' })
  @ApiResponse({
    status: 200,
    description: 'Comments with replies retrieved successfully',
  })
  async getCommentsWithReplies(@Param('postId') postId: string) {
    return await this.commentService.getCommentsWithReplies(postId);
  }

  @Post(':id/unlike')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Decrement comment like count' })
  @ApiResponse({ status: 200, description: 'Like count decremented' })
  async decrementLike(@Param('id') id: string) {
    await this.commentService.decrementLikes(id);
    return { message: 'Like count decremented' };
  }

  @Get('post/:postId/statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get comment statistics for a post' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getCommentStatistics(@Param('postId') postId: string) {
    return await this.commentService.getCommentStatistics(postId);
  }

  @Get('post/:postId/top-rated')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get top rated comments for a post' })
  @ApiResponse({
    status: 200,
    description: 'Top rated comments retrieved successfully',
  })
  async getTopRatedComments(
    @Param('postId') postId: string,
    @Query('limit') limit: string = '5',
  ) {
    return await this.commentService.getTopRatedComments(
      postId,
      parseInt(limit),
    );
  }
}
