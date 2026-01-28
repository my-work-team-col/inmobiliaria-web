/**
 * Command line arguments for seed execution
 */
export interface SeedOptions {
  force?: boolean;
  remote?: boolean;
}

/**
 * Result of seed execution
 */
export interface SeedResult {
  success: boolean;
  categoriesCreated: number;
  propertiesCreated: number;
  imagesCreated: number;
  imagesUploadedToCloudinary: number;
  errors: string[];
  warnings: string[];
  executionTime: number;
}

/**
 * Cloudinary batch upload result
 */
export interface CloudinaryBatchResult {
  totalImages: number;
  successfulUploads: number;
  failedUploads: number;
  uploadedUrls: Array<{
    id: string;
    url: string;
    publicId: string;
  }>;
  errors: Array<{
    imageId: string;
    error: string;
  }>;
}

/**
 * Database connection diagnostics
 */
export interface ConnectionDiagnostics {
  isConnected: boolean;
  isRemote: boolean;
  databaseType: 'local' | 'turso';
  responseTime: number;
  error?: string;
}