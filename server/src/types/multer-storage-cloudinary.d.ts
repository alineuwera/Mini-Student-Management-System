import { Request } from "express-serve-static-core";
import { File as MulterFile, StorageEngine } from "multer";

interface CloudinaryStorageParams {
  folder?: string;
  allowed_formats?: string[];
  public_id?: string;
}

interface CloudinaryStorageOptions {
  cloudinary: any;
  params: (req: Request, file: MulterFile) => Promise<CloudinaryStorageParams> | CloudinaryStorageParams;
}

declare class CloudinaryStorage implements StorageEngine {
  constructor(opts: CloudinaryStorageOptions);

  // multer StorageEngine methods
  _handleFile: StorageEngine["_handleFile"];
  _removeFile: StorageEngine["_removeFile"];
}

export { CloudinaryStorage };
