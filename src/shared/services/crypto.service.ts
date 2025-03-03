import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class CryptoService {
  generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  hashPassword(password: string, salt: string): string {
    const passwordtoHash = `${password}.${salt}`;
    return bcrypt.hashSync(passwordtoHash, 10);
  }
  verifyPassword(
    password: string,
    hashedPassword: string,
    salt: string,
  ): boolean {
    const passwordtoHash = `${password}.${salt}`;
    return bcrypt.compareSync(passwordtoHash, hashedPassword);
  }
}
