import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { memoryStorage } from 'multer';
import { CLOUDINARY_URL } from '../constant/app.constant';

export const CLOUDINARY_FOLDER = 'airbnb';
const MAX_FILE_SIZE = 5 * 1024 * 1024;

if (!CLOUDINARY_URL) {
  throw new Error('Missing CLOUDINARY_URL in .env');
}

const parsedCloudinaryUrl = new URL(CLOUDINARY_URL);

cloudinary.config({
  cloud_name: parsedCloudinaryUrl.hostname,
  api_key: parsedCloudinaryUrl.username,
  api_secret: parsedCloudinaryUrl.password,
  secure: true,
});

export const multerImageOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(new BadRequestException('Chi nhan file hinh anh'), false);
      return;
    }

    callback(null, true);
  },
};

export const uploadImageToCloudinary = async (
  file: Express.Multer.File,
  folder = CLOUDINARY_FOLDER,
) => {
  if (!file || !file.buffer) {
    throw new BadRequestException('Vui long gui file hinh_anh');
  }

  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error('Cloudinary upload failed'));
            return;
          }

          resolve(uploadResult);
        },
      );

      stream.end(file.buffer);
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new InternalServerErrorException('Upload hinh anh len Cloudinary that bai');
  }
};

const extractCloudinaryPublicId = (imageUrl: string) => {
  try {
    const parsedUrl = new URL(imageUrl);
    const segments = parsedUrl.pathname.split('/').filter(Boolean);
    const uploadIndex = segments.findIndex((segment) => segment === 'upload');

    if (uploadIndex === -1) {
      return null;
    }

    let assetSegments = segments.slice(uploadIndex + 1);
    const versionIndex = assetSegments.findIndex((segment) => /^v\d+$/.test(segment));

    if (versionIndex !== -1) {
      assetSegments = assetSegments.slice(versionIndex + 1);
    }

    if (!assetSegments.length) {
      return null;
    }

    const fileName = assetSegments[assetSegments.length - 1];
    const dotIndex = fileName.lastIndexOf('.');
    assetSegments[assetSegments.length - 1] =
      dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;

    return decodeURIComponent(assetSegments.join('/'));
  } catch {
    return null;
  }
};

export const deleteImageFromCloudinary = async (imageUrl?: string | null) => {
  if (!imageUrl) {
    return;
  }

  const publicId = extractCloudinaryPublicId(imageUrl);

  if (!publicId) {
    return;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });

    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error(`Cloudinary destroy failed: ${result.result}`);
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new InternalServerErrorException('Xoa hinh anh tren Cloudinary that bai');
  }
};
