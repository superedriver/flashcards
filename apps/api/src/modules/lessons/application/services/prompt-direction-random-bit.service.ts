import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptDirectionRandomBitService {
  nextBit(): 0 | 1 {
    return Math.random() < 0.5 ? 0 : 1;
  }
}
