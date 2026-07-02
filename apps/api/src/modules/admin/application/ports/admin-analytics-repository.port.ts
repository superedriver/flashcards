import { AdminDashboardStats } from '../../domain/types';

export const ADMIN_ANALYTICS_REPOSITORY = Symbol('ADMIN_ANALYTICS_REPOSITORY');

export type AdminAnalyticsRepositoryPort = {
  getDashboardStats(input: { now: Date }): Promise<AdminDashboardStats>;
};
