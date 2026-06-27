import * as argon2 from 'argon2';
import { PasswordHasherPort } from '../../application/ports/password-hasher.port';

export class Argon2PasswordHasher implements PasswordHasherPort {
  hash(password: string): Promise<string> {
    return argon2.hash(password);
  }

  verify(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
