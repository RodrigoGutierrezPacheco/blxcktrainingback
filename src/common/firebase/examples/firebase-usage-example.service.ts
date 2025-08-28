import { Injectable } from '@nestjs/common';
import { FirebaseStorageService, UploadResult } from '../firebase-storage.service';

@Injectable()
export class FirebaseUsageExampleService {
  constructor(private readonly firebaseStorage: FirebaseStorageService) {}

  /**
   * Example: Upload user profile picture
   */
  async uploadProfilePicture(
    userId: string,
    file: Express.Multer.File
  ): Promise<UploadResult> {
    const folder = 'profile-pictures';
    const customName = `user-${userId}-${Date.now()}.jpg`;
    
    return this.firebaseStorage.uploadFileWithCustomName(
      file,
      folder,
      customName
    );
  }

  /**
   * Example: Upload exercise image
   */
  async uploadExerciseImage(
    exerciseId: string,
    file: Express.Multer.File
  ): Promise<UploadResult> {
    const folder = 'exercises';
    const customName = `exercise-${exerciseId}-${Date.now()}.jpg`;
    
    return this.firebaseStorage.uploadFileWithCustomName(
      file,
      folder,
      customName
    );
  }

  /**
   * Example: Upload workout plan document
   */
  async uploadWorkoutPlan(
    planId: string,
    file: Express.Multer.File
  ): Promise<UploadResult> {
    const folder = 'workout-plans';
    const customName = `plan-${planId}-${Date.now()}.pdf`;
    
    return this.firebaseStorage.uploadFileWithCustomName(
      file,
      folder,
      customName
    );
  }

  /**
   * Example: Clean up user files when user is deleted
   */
  async cleanupUserFiles(userId: string): Promise<boolean> {
    try {
      // List all files in user's folders
      const profilePictures = await this.firebaseStorage.listFiles(`profile-pictures/user-${userId}`);
      const userDocuments = await this.firebaseStorage.listFiles(`users/${userId}`);
      
      // Delete profile pictures
      for (const filePath of profilePictures) {
        await this.firebaseStorage.deleteFile(filePath);
      }
      
      // Delete user documents
      for (const filePath of userDocuments) {
        await this.firebaseStorage.deleteFile(filePath);
      }
      
      return true;
    } catch (error) {
      console.error('Error cleaning up user files:', error);
      return false;
    }
  }

  /**
   * Example: Get file information for display
   */
  async getFileInfo(filePath: string) {
    const metadata = await this.firebaseStorage.getFileMetadata(filePath);
    const signedUrl = await this.firebaseStorage.getSignedUrl(filePath, 60); // 1 hour
    
    return {
      metadata,
      temporaryAccessUrl: signedUrl,
      permanentUrl: `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${filePath}`
    };
  }

  /**
   * Example: Validate file before upload
   */
  validateFile(file: Express.Multer.File): { valid: boolean; error?: string } {
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: 'File size exceeds 10MB limit' };
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return { valid: false, error: 'File type not allowed' };
    }
    
    return { valid: true };
  }
}
