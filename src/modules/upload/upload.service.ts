import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageTopic } from '../../models/schemas/iamgeTopic.schema';
import { IImageTopic } from '../../models/dtos/response.dtos/imageTopic';
import { Injectable } from '@nestjs/common';
import { ImageTopicDto } from '../../models/dtos/request.dtos/request.dtos';
import { join } from 'path';
import { promises as fs } from 'fs';
import type { Response } from 'express';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(ImageTopic.name)
    private images: Model<IImageTopic>,
  ) {}

  async update(model: ImageTopicDto): Promise<void> {
    const imgTopic = await this.images.findOne({ articleId: model.articleId });
    if (imgTopic)
      await this.images.findByIdAndUpdate({ _id: imgTopic.id }, model, {
        new: true,
      });
    else await this.images.create(model);
  }

  async deleteFile(fileName: string) {
    const imgTopic = await this.images.findOne({ fileNameUId: fileName });
    if (!imgTopic) {
      const pathFile = join(process.cwd(), 'wp-contents/' + fileName);
      await fs.unlink(pathFile);
    }
  }

  uploadFile(file: Express.Multer.File): { fileName: string } {
    return { fileName: file.filename };
  }

  getFile(id: string, res: Response) {
    return res.sendFile(join(process.cwd(), 'wp-contents/' + id));
  }
}
