import { socialMediaVerifications } from '../constants/social-verifications';
import { physicalVerifications } from '../constants/physical-verifications';
import { blockchainVerifications } from '../constants/blockchain-verifications';
import type { VerificationStatus, VerificationType } from '../store/verification-store';

export type VerificationCategory = 'social' | 'physical' | 'blockchain';

export const STELLAR_MAX_POINTS = 50;

export interface VerificationCatalogItem {
  id: VerificationType;
  title: string;
  description: string;
  category: VerificationCategory;
  availablePoints: number;
}

export interface CategorySummary {
  category: VerificationCategory;
  label: string;
  earnedPoints: number;
  availablePoints: number;
  completedCount: number;
  totalCount: number;
  completionPercentage: number;
}

export interface NextBestActionItem {
  id: VerificationType;
  title: string;
  description: string;
  category: VerificationCategory;
  points: number;
}

export interface RecentActivityItem {
  id: VerificationType;
  title: string;
  category: VerificationCategory;
  points: number;
  completedAt: Date;
}

export interface VerificationSummary {
  totalPoints: number;
  completedCount: number;
  totalCount: number;
  completionPercentage: number;
  totalAvailablePoints: number;
  categories: CategorySummary[];
  nextBestActions: NextBestActionItem[];
  recentActivity: RecentActivityItem[];
  isEmpty: boolean;
  isFullyCompleted: boolean;
  isHydrated: boolean;
}

const CATEGORY_LABELS: Record<VerificationCategory, string> = {
  social: 'Social',
  physical: 'Physical',
  blockchain: 'Blockchain',
};

export function getAvailablePoints(id: string, catalogPoints: number): number {
  if (id === 'stellar-transactions') {
    return STELLAR_MAX_POINTS;
  }
  return catalogPoints;
}

export function getVerificationCatalog(): VerificationCatalogItem[] {
  const social: VerificationCatalogItem[] = socialMediaVerifications.map((v) => ({
    id: v.id as VerificationType,
    title: v.title,
    description: v.description,
    category: 'social' as const,
    availablePoints: getAvailablePoints(v.id, v.points),
  }));

  const physical: VerificationCatalogItem[] = physicalVerifications.map((v) => ({
    id: v.id as VerificationType,
    title: v.title,
    description: v.description,
    category: 'physical' as const,
    availablePoints: getAvailablePoints(v.id, v.points),
  }));

  const blockchain: VerificationCatalogItem[] = blockchainVerifications.map((v) => ({
    id: v.id as VerificationType,
    title: v.title,
    description: v.description,
    category: 'blockchain' as const,
    availablePoints: getAvailablePoints(v.id, v.points),
  }));

  return [...social, ...physical, ...blockchain];
}

function parseCompletedAt(value: Date | string | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildCategorySummaries(
  catalog: VerificationCatalogItem[],
  completedVerifications: Record<string, VerificationStatus>,
): CategorySummary[] {
  const categories: VerificationCategory[] = ['social', 'physical', 'blockchain'];

  return categories.map((category) => {
    const items = catalog.filter((item) => item.category === category);
    const completedItems = items.filter((item) => completedVerifications[item.id]?.completed);

    const earnedPoints = completedItems.reduce(
      (sum, item) => sum + (completedVerifications[item.id]?.points ?? 0),
      0,
    );
    const availablePoints = items.reduce((sum, item) => sum + item.availablePoints, 0);

    return {
      category,
      label: CATEGORY_LABELS[category],
      earnedPoints,
      availablePoints,
      completedCount: completedItems.length,
      totalCount: items.length,
      completionPercentage:
        items.length > 0 ? Math.round((completedItems.length / items.length) * 100) : 0,
    };
  });
}

export function buildVerificationSummary(
  completedVerifications: Record<string, VerificationStatus>,
  isHydrated: boolean,
): VerificationSummary {
  const catalog = getVerificationCatalog();
  const totalCount = catalog.length;
  const totalAvailablePoints = catalog.reduce((sum, item) => sum + item.availablePoints, 0);

  if (!isHydrated) {
    return {
      totalPoints: 0,
      completedCount: 0,
      totalCount,
      completionPercentage: 0,
      totalAvailablePoints,
      categories: buildCategorySummaries(catalog, {}),
      nextBestActions: [],
      recentActivity: [],
      isEmpty: true,
      isFullyCompleted: false,
      isHydrated: false,
    };
  }

  const completedEntries = Object.values(completedVerifications).filter((v) => v.completed);
  const completedCount = completedEntries.length;
  const totalPoints = completedEntries.reduce((sum, v) => sum + v.points, 0);

  const nextBestActions: NextBestActionItem[] = catalog
    .filter((item) => !completedVerifications[item.id]?.completed)
    .map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      points: item.availablePoints,
    }))
    .sort((a, b) => b.points - a.points);

  const recentActivity: RecentActivityItem[] = completedEntries
    .map((entry) => {
      const catalogItem = catalog.find((item) => item.id === entry.id);
      const completedAt = parseCompletedAt(entry.completedAt);
      if (!catalogItem || !completedAt) return null;

      return {
        id: entry.id,
        title: catalogItem.title,
        category: entry.type,
        points: entry.points,
        completedAt,
      };
    })
    .filter((item): item is RecentActivityItem => item !== null)
    .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());

  return {
    totalPoints,
    completedCount,
    totalCount,
    completionPercentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    totalAvailablePoints,
    categories: buildCategorySummaries(catalog, completedVerifications),
    nextBestActions,
    recentActivity,
    isEmpty: totalPoints === 0,
    isFullyCompleted: completedCount === totalCount && totalCount > 0,
    isHydrated: true,
  };
}
