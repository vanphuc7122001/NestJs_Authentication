import { BadRequestException, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { extname } from 'path';

@Injectable()
export class MediaService {
  private readonly s3Client = new S3({
    region: this.configService.get('AWS_REGION'),
    credentials: {
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    },
  });

  constructor(private readonly configService: ConfigService) {}

  uploadFile(filename, mimetype, fileBody) {
    const extList = ['.png', '.jpeg', '.jpg'];
    const extName = extname(filename);
    const fileNameEdited = `${filename.replace(extName, '')}-${new Date().getTime()}${extName}`;
    const valid =
      Boolean(mimetype?.includes('image/')) && extList.includes(extName);
    console.log('valid', valid);
    if (!valid) {
      throw new BadRequestException(`Invalid image ${extName}`);
    }

    return this.uploadFileToS3(fileNameEdited, fileBody, mimetype);
  }

  async uploadFileToS3(filename, fileBody, contentType) {
    const parallelUploads3 = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.configService.get('AWS_BUCKET_S3'),
        Key: filename,
        Body: fileBody,
        ContentType: contentType,
      },

      tags: [
        /*...*/
      ], // optional tags
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false, // optional manually handle dropped parts
    });

    return await parallelUploads3.done();
  }
}
