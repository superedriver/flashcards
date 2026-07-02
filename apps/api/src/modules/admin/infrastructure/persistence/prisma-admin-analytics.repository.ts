import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import { AdminAnalyticsRepositoryPort } from '../../application/ports/admin-analytics-repository.port';
import { AdminDashboardStats } from '../../domain/types';

const DAYS_IN_WINDOW = 7;

@Injectable()
export class PrismaAdminAnalyticsRepository implements AdminAnalyticsRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(input: { now: Date }): Promise<AdminDashboardStats> {
    const windowStart = new Date(input.now);
    windowStart.setDate(windowStart.getDate() - DAYS_IN_WINDOW);

    const [
      totalUsers,
      totalDecks,
      totalPublicDecks,
      totalCards,
      totalStudySessions,
      totalReviews,
      usersCreatedLast7Days,
      decksCreatedLast7Days,
      reviewsSubmittedLast7Days,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.deck.count({ where: { deletedAt: null } }),
      this.prisma.deck.count({
        where: {
          deletedAt: null,
          visibility: 'PUBLIC',
          moderationStatus: 'APPROVED',
        },
      }),
      this.prisma.card.count({ where: { deletedAt: null } }),
      this.prisma.studySession.count(),
      this.prisma.studySessionReview.count(),
      this.prisma.user.count({
        where: {
          deletedAt: null,
          createdAt: { gte: windowStart },
        },
      }),
      this.prisma.deck.count({
        where: {
          deletedAt: null,
          createdAt: { gte: windowStart },
        },
      }),
      this.prisma.studySessionReview.count({
        where: {
          createdAt: { gte: windowStart },
        },
      }),
    ]);

    return {
      totalUsers,
      totalDecks,
      totalPublicDecks,
      totalCards,
      totalStudySessions,
      totalReviews,
      usersCreatedLast7Days,
      decksCreatedLast7Days,
      reviewsSubmittedLast7Days,
    };
  }
}
