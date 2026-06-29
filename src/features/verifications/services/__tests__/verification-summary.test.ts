import {
  buildVerificationSummary,
  getAvailablePoints,
  getVerificationCatalog,
  STELLAR_MAX_POINTS,
} from '../verification-summary';
import type { VerificationStatus } from '../../store/verification-store';

describe('getAvailablePoints', () => {
  it('returns max stellar points for stellar-transactions', () => {
    expect(getAvailablePoints('stellar-transactions', 0)).toBe(STELLAR_MAX_POINTS);
  });

  it('returns catalog points for other verifications', () => {
    expect(getAvailablePoints('google', 6)).toBe(6);
    expect(getAvailablePoints('government-id', 1000)).toBe(1000);
  });
});

describe('getVerificationCatalog', () => {
  it('includes social, physical, and blockchain verifications', () => {
    const catalog = getVerificationCatalog();
    const categories = new Set(catalog.map((item) => item.category));

    expect(categories.has('social')).toBe(true);
    expect(categories.has('physical')).toBe(true);
    expect(categories.has('blockchain')).toBe(true);
    expect(catalog.length).toBeGreaterThan(0);
  });

  it('assigns stellar max points to blockchain stellar entry', () => {
    const stellar = getVerificationCatalog().find((item) => item.id === 'stellar-transactions');
    expect(stellar?.availablePoints).toBe(STELLAR_MAX_POINTS);
  });
});

describe('buildVerificationSummary', () => {
  const catalog = getVerificationCatalog();

  it('returns empty summary before hydration', () => {
    const completed: Record<string, VerificationStatus> = {
      google: {
        id: 'google',
        type: 'social',
        completed: true,
        completedAt: new Date('2026-01-15T10:00:00Z'),
        points: 6,
      },
    };

    const summary = buildVerificationSummary(completed, false);

    expect(summary.isHydrated).toBe(false);
    expect(summary.totalPoints).toBe(0);
    expect(summary.completedCount).toBe(0);
    expect(summary.nextBestActions).toHaveLength(0);
    expect(summary.recentActivity).toHaveLength(0);
    expect(summary.totalCount).toBe(catalog.length);
  });

  it('aggregates completed verifications after hydration', () => {
    const completed: Record<string, VerificationStatus> = {
      google: {
        id: 'google',
        type: 'social',
        completed: true,
        completedAt: new Date('2026-01-15T10:00:00Z'),
        points: 6,
      },
      github: {
        id: 'github',
        type: 'social',
        completed: true,
        completedAt: new Date('2026-01-20T14:30:00Z'),
        points: 6,
      },
    };

    const summary = buildVerificationSummary(completed, true);

    expect(summary.isHydrated).toBe(true);
    expect(summary.totalPoints).toBe(12);
    expect(summary.completedCount).toBe(2);
    expect(summary.completionPercentage).toBe(
      Math.round((2 / catalog.length) * 100),
    );
    expect(summary.isEmpty).toBe(false);
    expect(summary.isFullyCompleted).toBe(false);
  });

  it('builds per-category point breakdown', () => {
    const completed: Record<string, VerificationStatus> = {
      google: {
        id: 'google',
        type: 'social',
        completed: true,
        completedAt: new Date('2026-01-15T10:00:00Z'),
        points: 6,
      },
      'email-verification': {
        id: 'email-verification',
        type: 'physical',
        completed: true,
        completedAt: new Date('2026-01-16T10:00:00Z'),
        points: 500,
      },
    };

    const summary = buildVerificationSummary(completed, true);
    const social = summary.categories.find((c) => c.category === 'social');
    const physical = summary.categories.find((c) => c.category === 'physical');

    expect(social?.earnedPoints).toBe(6);
    expect(social?.completedCount).toBe(1);
    expect(physical?.earnedPoints).toBe(500);
    expect(physical?.completedCount).toBe(1);
  });

  it('lists next best actions sorted by points descending', () => {
    const summary = buildVerificationSummary({}, true);

    expect(summary.nextBestActions.length).toBeGreaterThan(0);
    for (let i = 1; i < summary.nextBestActions.length; i++) {
      expect(summary.nextBestActions[i - 1].points).toBeGreaterThanOrEqual(
        summary.nextBestActions[i].points,
      );
    }

    const topAction = summary.nextBestActions[0];
    expect(topAction.points).toBeGreaterThanOrEqual(500);
  });

  it('excludes completed verifications from next best actions', () => {
    const completed: Record<string, VerificationStatus> = {
      'government-id': {
        id: 'government-id',
        type: 'physical',
        completed: true,
        completedAt: new Date('2026-01-15T10:00:00Z'),
        points: 1000,
      },
    };

    const summary = buildVerificationSummary(completed, true);

    expect(summary.nextBestActions.some((a) => a.id === 'government-id')).toBe(false);
  });

  it('orders recent activity by completedAt descending', () => {
    const completed: Record<string, VerificationStatus> = {
      google: {
        id: 'google',
        type: 'social',
        completed: true,
        completedAt: new Date('2026-01-10T10:00:00Z'),
        points: 6,
      },
      github: {
        id: 'github',
        type: 'social',
        completed: true,
        completedAt: new Date('2026-01-20T14:30:00Z'),
        points: 6,
      },
    };

    const summary = buildVerificationSummary(completed, true);

    expect(summary.recentActivity).toHaveLength(2);
    expect(summary.recentActivity[0].id).toBe('github');
    expect(summary.recentActivity[1].id).toBe('google');
  });

  it('handles serialized completedAt strings from persisted store', () => {
    const completed = {
      google: {
        id: 'google' as const,
        type: 'social' as const,
        completed: true,
        completedAt: '2026-01-15T10:00:00.000Z' as unknown as Date,
        points: 6,
      },
    };

    const summary = buildVerificationSummary(completed, true);

    expect(summary.recentActivity).toHaveLength(1);
    expect(summary.recentActivity[0].completedAt).toBeInstanceOf(Date);
  });

  it('marks fully completed state when all verifications are done', () => {
    const completed = Object.fromEntries(
      catalog.map((item) => [
        item.id,
        {
          id: item.id,
          type: item.category,
          completed: true,
          completedAt: new Date('2026-01-15T10:00:00Z'),
          points: item.availablePoints,
        },
      ]),
    ) as Record<string, VerificationStatus>;

    const summary = buildVerificationSummary(completed, true);

    expect(summary.isFullyCompleted).toBe(true);
    expect(summary.completedCount).toBe(catalog.length);
    expect(summary.nextBestActions).toHaveLength(0);
  });

  it('uses stored points for dynamic stellar verification', () => {
    const completed: Record<string, VerificationStatus> = {
      'stellar-transactions': {
        id: 'stellar-transactions',
        type: 'blockchain',
        completed: true,
        completedAt: new Date('2026-01-15T10:00:00Z'),
        points: 25,
      },
    };

    const summary = buildVerificationSummary(completed, true);
    const blockchain = summary.categories.find((c) => c.category === 'blockchain');

    expect(blockchain?.earnedPoints).toBe(25);
    expect(blockchain?.availablePoints).toBe(STELLAR_MAX_POINTS);
  });
});
