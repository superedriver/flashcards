import { randomBytes } from 'node:crypto';
import { TokenGeneratorPort } from '../../application/ports/token-generator.port';

export class NodeTokenGenerator implements TokenGeneratorPort {
  generateRefreshToken(): string {
    return randomBytes(32).toString('base64url');
  }
}
