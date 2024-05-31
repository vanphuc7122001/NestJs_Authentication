import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import { MediaService } from '../services';

@Controller('medias')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('fileImg'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 1024 * 1024,
          message: 'File size maximum is 1MB',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.mediaService.uploadFile(
      file.originalname,
      file.mimetype,
      file.buffer,
    );

    return {
      url: (result as CompleteMultipartUploadCommandOutput).Location as string,
    };
  }
}
