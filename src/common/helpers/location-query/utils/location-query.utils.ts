import {
  locationSearchFields,
  type LocationFiltersMap,
  type LocationQueryInput,
  type LocationWhereInput,
  type PaginationState,
} from '../types/location-query.types';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 5;

const buildContainsFilter = (value?: string) => {
  const normalizedValue = value?.trim();

  return normalizedValue ? { contains: normalizedValue } : undefined;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const safeParseJsonObject = (value: string): Record<string, unknown> | undefined => {
  try {
    const parsed = JSON.parse(value);

    return isPlainObject(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

const buildTextFilters = (query: LocationQueryInput): LocationFiltersMap =>
  (
    [
      ['ten_vi_tri', query.ten_vi_tri],
      ['tinh_thanh', query.tinh_thanh],
      ['quoc_gia', query.quoc_gia],
    ] as const
  ).reduce<LocationFiltersMap>((acc, [field, value]) => {
    const filter = buildContainsFilter(value);

    if (filter) {
      acc[field] = filter;
    }

    return acc;
  }, {});

const buildObjectFilters = (
  filters: LocationQueryInput['filters'],
): LocationFiltersMap => {
  if (!filters) {
    return {};
  }

  const parsedFilters =
    typeof filters === 'string'
      ? safeParseJsonObject(filters)
      : isPlainObject(filters)
        ? filters
        : undefined;

  if (!parsedFilters) {
    return {};
  }

  return locationSearchFields.reduce<LocationFiltersMap>((acc, field) => {
    const value = parsedFilters[field];
    const filter = buildContainsFilter(typeof value === 'string' ? value : undefined);

    if (filter) {
      acc[field] = filter;
    }

    return acc;
  }, {});
};

export const normalizeLocationPagination = (
  query: Pick<LocationQueryInput, 'page' | 'pageSize'>,
): PaginationState => {
  let page = Number(query.page ?? DEFAULT_PAGE);
  let pageSize = Number(query.pageSize ?? DEFAULT_PAGE_SIZE);

  if (!Number.isFinite(page) || page < 1) {
    page = DEFAULT_PAGE;
  }

  if (!Number.isFinite(pageSize) || pageSize < 1) {
    pageSize = DEFAULT_PAGE_SIZE;
  }

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
    hasPagination: query.page !== undefined || query.pageSize !== undefined,
  };
};

export const buildLocationWhere = (
  query: LocationQueryInput,
): LocationWhereInput => ({
  isDeleted: false,
  ...buildObjectFilters(query.filters),
  ...buildTextFilters(query),
});
