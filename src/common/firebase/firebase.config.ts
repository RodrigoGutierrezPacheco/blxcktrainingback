import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseConfig implements OnModuleInit {
  private storage: admin.storage.Storage;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      const serviceAccount = {
        type: this.configService.get<string>('FIREBASE_TYPE'),
        project_id: this.configService.get<string>('FIREBASE_PROJECT_ID'),
        private_key_id: this.configService.get<string>('FIREBASE_PRIVATE_KEY_ID'),
        private_key: this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
        client_email: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        client_id: this.configService.get<string>('FIREBASE_CLIENT_ID'),
        auth_uri: this.configService.get<string>('FIREBASE_AUTH_URI'),
        token_uri: this.configService.get<string>('FIREBASE_TOKEN_URI'),
        auth_provider_x509_cert_url: this.configService.get<string>('FIREBASE_AUTH_PROVIDER_X509_CERT_URL'),
        client_x509_cert_url: this.configService.get<string>('FIREBASE_CLIENT_X509_CERT_URL'),
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET'),
      });
    }

    this.storage = admin.storage();
  }

  getStorage(): admin.storage.Storage {
    return this.storage;
  }

  getBucket(): any {
    return this.storage.bucket();
  }
}
