import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService, ErrorStateService } from '@core';

/**
 * Upload Options
 */
export interface UploadOptions {
  /** File path in bucket */
  path: string;
  /** File to upload */
  file: File | Blob;
  /** Bucket name (default: 'documents') */
  bucket?: string;
  /** Content type */
  contentType?: string;
  /** Cache control header */
  cacheControl?: string;
  /** Whether file should be upsert (overwrite if exists) */
  upsert?: boolean;
}

/**
 * Download Options
 */
export interface DownloadOptions {
  /** File path in bucket */
  path: string;
  /** Bucket name (default: 'documents') */
  bucket?: string;
  /** Transform options for images */
  transform?: {
    width?: number;
    height?: number;
    resize?: 'cover' | 'contain' | 'fill';
    quality?: number;
  };
}

/**
 * File Info
 */
export interface FileInfo {
  /** File path */
  path: string;
  /** File size in bytes */
  size: number;
  /** Last modified timestamp */
  lastModified: Date;
  /** Content type */
  contentType?: string;
  /** Bucket name */
  bucket: string;
}

/**
 * Upload Result
 */
export interface UploadResult {
  /** Success flag */
  success: boolean;
  /** File path */
  path: string;
  /** Public URL */
  publicUrl?: string;
  /** Signed URL (if applicable) */
  signedUrl?: string;
  /** Error message */
  error?: string;
}

/**
 * Storage Facade
 *
 * Enterprise-grade file storage management facade using Supabase Storage.
 * Provides unified interface for file upload, download, deletion, and URL generation.
 *
 * Design Principles:
 * - Signal-based state management (Angular 20)
 * - Facade pattern: Component → Facade → Supabase Storage
 * - Non-invasive error handling via ErrorStateService
 * - Type-safe file operations
 * - Multiple bucket support
 * - Image transformation support
 *
 * Key Features:
 * - File upload with progress tracking
 * - File download
 * - File deletion
 * - Public URL generation
 * - Signed URL generation (for private files)
 * - List files in path
 * - Batch operations
 * - Image transformation
 *
 * @example
 * ```typescript
 * const storageFacade = inject(StorageFacade);
 *
 * // Upload file
 * const result = await storageFacade.uploadFile({
 *   path: 'blueprints/blueprint-123/document.pdf',
 *   file: fileBlob,
 *   bucket: 'documents'
 * });
 *
 * // Get public URL
 * const url = storageFacade.getPublicUrl('documents', 'path/to/file.pdf');
 *
 * // Download file
 * const blob = await storageFacade.downloadFile({
 *   path: 'path/to/file.pdf',
 *   bucket: 'documents'
 * });
 *
 * // Delete file
 * await storageFacade.deleteFile('documents', 'path/to/file.pdf');
 * ```
 *
 * @see https://supabase.com/docs/guides/storage
 */
@Injectable({
  providedIn: 'root'
})
export class StorageFacade {
  // Inject dependencies
  private readonly supabase = inject(SupabaseService);
  private readonly errorService = inject(ErrorStateService);

  // Signal state
  private readonly uploadingState = signal<boolean>(false);
  private readonly uploadProgressState = signal<number>(0);
  private readonly lastOperationState = signal<string | null>(null);

  // Readonly signals
  /** Whether file upload is in progress */
  readonly uploading = this.uploadingState.asReadonly();

  /** Upload progress (0-100) */
  readonly uploadProgress = this.uploadProgressState.asReadonly();

  /** Last operation performed */
  readonly lastOperation = this.lastOperationState.asReadonly();

  // Default bucket
  private readonly DEFAULT_BUCKET = 'documents';

  // ============================================================================
  // File Upload
  // ============================================================================

  /**
   * Upload file to storage
   *
   * @param options Upload options
   * @returns Promise<UploadResult>
   */
  async uploadFile(options: UploadOptions): Promise<UploadResult> {
    const bucket = options.bucket || this.DEFAULT_BUCKET;
    this.uploadingState.set(true);
    this.uploadProgressState.set(0);
    this.lastOperationState.set('upload_file');

    try {
      const { data, error } = await this.supabase.client.storage.from(bucket).upload(options.path, options.file, {
        contentType: options.contentType,
        cacheControl: options.cacheControl || '3600',
        upsert: options.upsert || false
      });

      if (error) {
        throw error;
      }

      this.uploadProgressState.set(100);

      const publicUrl = this.getPublicUrl(bucket, options.path);

      console.log('[StorageFacade] File uploaded:', options.path);

      return {
        success: true,
        path: data.path,
        publicUrl
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      console.error('[StorageFacade] Upload error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'StorageFacade.uploadFile'
      });

      return {
        success: false,
        path: options.path,
        error: errorMessage
      };
    } finally {
      this.uploadingState.set(false);
    }
  }

  /**
   * Upload multiple files
   *
   * @param files Array of upload options
   * @returns Promise<UploadResult[]>
   */
  async uploadFiles(files: UploadOptions[]): Promise<UploadResult[]> {
    this.lastOperationState.set('upload_files_batch');

    const results: UploadResult[] = [];

    for (const file of files) {
      const result = await this.uploadFile(file);
      results.push(result);
    }

    return results;
  }

  // ============================================================================
  // File Download
  // ============================================================================

  /**
   * Download file from storage
   *
   * @param options Download options
   * @returns Promise<Blob>
   */
  async downloadFile(options: DownloadOptions): Promise<Blob> {
    const bucket = options.bucket || this.DEFAULT_BUCKET;
    this.lastOperationState.set('download_file');

    try {
      const { data, error } = await this.supabase.client.storage
        .from(bucket)
        .download(options.path, options.transform ? { transform: options.transform } : undefined);

      if (error) {
        throw error;
      }

      console.log('[StorageFacade] File downloaded:', options.path);

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to download file';
      console.error('[StorageFacade] Download error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'StorageFacade.downloadFile'
      });
      throw error;
    }
  }

  // ============================================================================
  // File Deletion
  // ============================================================================

  /**
   * Delete file from storage
   *
   * @param bucket Bucket name
   * @param path File path
   * @returns Promise<void>
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    this.lastOperationState.set('delete_file');

    try {
      const { error } = await this.supabase.client.storage.from(bucket).remove([path]);

      if (error) {
        throw error;
      }

      console.log('[StorageFacade] File deleted:', path);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete file';
      console.error('[StorageFacade] Delete error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'StorageFacade.deleteFile'
      });
      throw error;
    }
  }

  /**
   * Delete multiple files
   *
   * @param bucket Bucket name
   * @param paths Array of file paths
   * @returns Promise<void>
   */
  async deleteFiles(bucket: string, paths: string[]): Promise<void> {
    this.lastOperationState.set('delete_files_batch');

    try {
      const { error } = await this.supabase.client.storage.from(bucket).remove(paths);

      if (error) {
        throw error;
      }

      console.log('[StorageFacade] Files deleted:', paths.length);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete files';
      console.error('[StorageFacade] Delete batch error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'StorageFacade.deleteFiles'
      });
      throw error;
    }
  }

  // ============================================================================
  // URL Generation
  // ============================================================================

  /**
   * Get public URL for file
   *
   * For files in public buckets only.
   *
   * @param bucket Bucket name
   * @param path File path
   * @returns Public URL
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.supabase.client.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  /**
   * Create signed URL for file
   *
   * For private files with time-limited access.
   *
   * @param bucket Bucket name
   * @param path File path
   * @param expiresIn Expiration time in seconds (default: 3600)
   * @returns Promise<string> Signed URL
   */
  async createSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<string> {
    this.lastOperationState.set('create_signed_url');

    try {
      const { data, error } = await this.supabase.client.storage.from(bucket).createSignedUrl(path, expiresIn);

      if (error) {
        throw error;
      }

      return data.signedUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create signed URL';
      console.error('[StorageFacade] Create signed URL error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'StorageFacade.createSignedUrl'
      });
      throw error;
    }
  }

  /**
   * Create signed URLs for multiple files
   *
   * @param bucket Bucket name
   * @param paths Array of file paths
   * @param expiresIn Expiration time in seconds
   * @returns Promise<Record<string, string>> Map of path to signed URL
   */
  async createSignedUrls(bucket: string, paths: string[], expiresIn = 3600): Promise<Record<string, string>> {
    this.lastOperationState.set('create_signed_urls_batch');

    const urls: Record<string, string> = {};

    try {
      const { data, error } = await this.supabase.client.storage.from(bucket).createSignedUrls(paths, expiresIn);

      if (error) {
        throw error;
      }

      data.forEach((item, index) => {
        if (item.signedUrl) {
          urls[paths[index]] = item.signedUrl;
        }
      });

      return urls;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create signed URLs';
      console.error('[StorageFacade] Create signed URLs error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'StorageFacade.createSignedUrls'
      });
      throw error;
    }
  }

  // ============================================================================
  // File Listing
  // ============================================================================

  /**
   * List files in path
   *
   * @param bucket Bucket name
   * @param path Folder path (default: '')
   * @param options List options
   * @returns Promise<FileInfo[]>
   */
  async listFiles(
    bucket: string,
    path = '',
    options?: {
      limit?: number;
      offset?: number;
      sortBy?: { column: string; order: 'asc' | 'desc' };
    }
  ): Promise<FileInfo[]> {
    this.lastOperationState.set('list_files');

    try {
      const { data, error } = await this.supabase.client.storage.from(bucket).list(path, options);

      if (error) {
        throw error;
      }

      return data.map(file => ({
        path: path ? `${path}/${file.name}` : file.name,
        size: file.metadata?.['size'] || 0,
        lastModified: new Date(file.updated_at || file.created_at),
        contentType: file.metadata?.['mimetype'],
        bucket
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to list files';
      console.error('[StorageFacade] List files error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'StorageFacade.listFiles'
      });
      return [];
    }
  }

  // ============================================================================
  // File Operations
  // ============================================================================

  /**
   * Move file to new path
   *
   * @param bucket Bucket name
   * @param fromPath Source path
   * @param toPath Destination path
   * @returns Promise<void>
   */
  async moveFile(bucket: string, fromPath: string, toPath: string): Promise<void> {
    this.lastOperationState.set('move_file');

    try {
      const { error } = await this.supabase.client.storage.from(bucket).move(fromPath, toPath);

      if (error) {
        throw error;
      }

      console.log('[StorageFacade] File moved:', fromPath, '->', toPath);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to move file';
      console.error('[StorageFacade] Move file error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'StorageFacade.moveFile'
      });
      throw error;
    }
  }

  /**
   * Copy file to new path
   *
   * @param bucket Bucket name
   * @param fromPath Source path
   * @param toPath Destination path
   * @returns Promise<void>
   */
  async copyFile(bucket: string, fromPath: string, toPath: string): Promise<void> {
    this.lastOperationState.set('copy_file');

    try {
      const { error } = await this.supabase.client.storage.from(bucket).copy(fromPath, toPath);

      if (error) {
        throw error;
      }

      console.log('[StorageFacade] File copied:', fromPath, '->', toPath);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to copy file';
      console.error('[StorageFacade] Copy file error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'StorageFacade.copyFile'
      });
      throw error;
    }
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Reset upload progress
   */
  resetUploadProgress(): void {
    this.uploadProgressState.set(0);
    this.uploadingState.set(false);
  }

  /**
   * Clear errors
   */
  clearErrors(): void {
    this.errorService.clearActiveErrors();
  }
}
