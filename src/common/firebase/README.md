# Firebase Storage Configuration

This module provides Firebase Storage integration for the BlxckTraining backend application.

## Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Storage in the Firebase console
4. Go to Project Settings > Service Accounts
5. Click "Generate new private key" to download your service account JSON file

### 2. Environment Variables

Add the following variables to your `.env` file:

```env
# Firebase Configuration
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email%40your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

**Important**: The `FIREBASE_PRIVATE_KEY` should be the entire private key including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts.

### 3. Service Account JSON Structure

Your service account JSON should look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account-email@your-project.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email%40your-project.iam.gserviceaccount.com"
}
```

## Usage

### 1. Basic File Upload

```typescript
import { FirebaseStorageService } from './common/firebase';

@Injectable()
export class YourService {
  constructor(private firebaseStorage: FirebaseStorageService) {}

  async uploadFile(file: Express.Multer.File) {
    const result = await this.firebaseStorage.uploadFileWithCustomName(
      file,
      'uploads',
      'custom-filename.jpg'
    );
    
    if (result.success) {
      console.log('File uploaded:', result.url);
    }
  }
}
```

### 2. Available Endpoints

The module provides the following REST endpoints:

- `POST /storage/upload` - Upload file to default folder
- `POST /storage/upload/:folder` - Upload file to specific folder
- `GET /storage/files/:folder` - List files in a folder
- `GET /storage/metadata/:path` - Get file metadata
- `GET /storage/signed-url/:path` - Get temporary access URL
- `DELETE /storage/:path` - Delete a file
- `GET /storage/exists/:path` - Check if file exists

### 3. File Validation

Files are automatically validated for:
- Maximum size: 10MB
- Allowed types: jpg, jpeg, png, gif, pdf, doc, docx

### 4. Service Methods

#### Upload Methods
- `uploadFile(file, destinationPath, metadata?)` - Upload with custom path
- `uploadFileWithCustomName(file, folder, customName?)` - Upload with custom name

#### File Management
- `deleteFile(filePath)` - Delete a file
- `getFileMetadata(filePath)` - Get file information
- `fileExists(filePath)` - Check file existence
- `listFiles(folderPath)` - List files in folder

#### Access Control
- `getSignedUrl(filePath, expirationMinutes)` - Generate temporary access URL

## Security Considerations

1. **Service Account**: Keep your service account JSON secure and never commit it to version control
2. **File Types**: Only allow necessary file types for your application
3. **File Size**: Set appropriate file size limits
4. **Access Control**: Use signed URLs for temporary access instead of making all files public
5. **Folder Structure**: Organize files in logical folders for better management

## Error Handling

The service includes comprehensive error handling and logging:

```typescript
const result = await this.firebaseStorage.uploadFile(file, 'uploads');
if (!result.success) {
  console.error('Upload failed:', result.error);
  // Handle error appropriately
}
```

## Testing

To test the Firebase Storage integration:

1. Ensure your environment variables are set correctly
2. Start the application
3. Use the `/storage/upload` endpoint to upload a test file
4. Verify the file appears in your Firebase Storage console

## Troubleshooting

### Common Issues

1. **Authentication Error**: Check your service account credentials and ensure the JSON is properly formatted
2. **Bucket Not Found**: Verify the `FIREBASE_STORAGE_BUCKET` environment variable
3. **Permission Denied**: Ensure your service account has Storage Admin or Object Admin permissions
4. **Private Key Format**: Make sure the private key includes the full PEM format with headers

### Debug Mode

Enable debug logging by setting the log level in your application configuration.

## Dependencies

- `firebase-admin`: Firebase Admin SDK for Node.js
- `@nestjs/config`: Configuration management
- `@nestjs/common`: Core NestJS functionality
