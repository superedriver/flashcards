import { Controller, Post, UseGuards } from '@nestjs/common';
import { InternalJobGuard } from '../../../../common/guards/internal-job.guard';
import { SendDueCardRemindersUseCase } from '../../application/use-cases/send-due-card-reminders.use-case';

@Controller('internal/jobs')
export class InternalNotificationsController {
  constructor(
    private readonly sendDueCardRemindersUseCase: SendDueCardRemindersUseCase,
  ) {}

  @Post('due-card-reminders')
  @UseGuards(InternalJobGuard)
  async runDueCardReminders(): Promise<{
    checkedUsers: number;
    notifiedUsers: number;
    sentMessages: number;
    failedMessages: number;
  }> {
    return this.sendDueCardRemindersUseCase.execute({
      now: new Date(),
    });
  }
}
