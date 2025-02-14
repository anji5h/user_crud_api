import { Injectable } from '@nestjs/common';
import { scrypt, randomBytes } from 'crypto';

@Injectable()
export class HashService {
  private readonly keyLength = 64;

  constructor() {}

  async hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');

    const derivedKey: Buffer = await new Promise((resolve, reject) => {
      scrypt(password, salt, this.keyLength, (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey);
      });
    });

    return `${salt}:${derivedKey.toString('hex')}`;
  }

  async verifyPassword(password: string, hash: string) {
    const [salt, key] = hash.split(':');

    const derivedKey: Buffer = await new Promise((resolve, reject) => {
      scrypt(password, salt, this.keyLength, (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey);
      });
    });

    return key === derivedKey.toString('hex');
  }
}
