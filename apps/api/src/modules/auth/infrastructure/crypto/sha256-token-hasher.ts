import { createHash } from 'node:crypto';
import { TokenHasherPort } from '../../application/ports/token-hasher.port';

export class Sha256TokenHasher implements TokenHasherPort {
  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
