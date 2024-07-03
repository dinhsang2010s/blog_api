import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ImageTopic,
  ImageTopicSchema,
} from '../../models/schemas/iamgeTopic.schema';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImageTopic.name, schema: ImageTopicSchema },
    ]),
  ],
  exports: [UploadService],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
