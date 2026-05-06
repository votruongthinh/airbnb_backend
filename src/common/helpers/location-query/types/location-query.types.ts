import type { Prisma } from 'src/modules-system/prisma/generated/prisma/client.js';

export const locationSearchFields = [
  'ten_vi_tri',
  'tinh_thanh',
  'quoc_gia',
] as const;

export type LocationSearchField = (typeof locationSearchFields)[number];

export type LocationContainsFilter = {
  contains: string;
};

export type LocationFiltersMap = Partial<
  Record<LocationSearchField, LocationContainsFilter>
>;

export type LocationQueryInput = {
  page?: number;
  pageSize?: number;
  filters?: Record<string, unknown> | string;
  ten_vi_tri?: string;
  tinh_thanh?: string;
  quoc_gia?: string;
};

export type LocationWhereInput = Prisma.ViTriWhereInput;

export type PaginationState = {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
  hasPagination: boolean;
};
