import { QueryLocationDto } from 'src/modules-api/location/dto/query-location.dto';

const locationSearchFields = ['ten_vi_tri', 'tinh_thanh', 'quoc_gia'] as const;

type LocationSearchField = (typeof locationSearchFields)[number];

const toContainsFilter = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return undefined;
  }

  return {
    contains: normalizedValue,
  };
};

const normalizeFilters = (
  filters: QueryLocationDto['filters'] | string | undefined,
) => {
  if (!filters) {
    return {};
  }

  let parsedFilters: unknown = filters;

  if (typeof parsedFilters === 'string') {
    try {
      parsedFilters = JSON.parse(parsedFilters);
    } catch {
      return {};
    }
  }

  if (
    !parsedFilters ||
    typeof parsedFilters !== 'object' ||
    Array.isArray(parsedFilters)
  ) {
    return {};
  }

  const whereFilters: Partial<
    Record<LocationSearchField, { contains: string }>
  > = {};

  locationSearchFields.forEach((field) => {
    const value = parsedFilters[field];

    if (typeof value === 'string' && value.trim()) {
      whereFilters[field] = {
        contains: value.trim(),
      };
    }
  });

  return whereFilters;
};

export const buildQueryPrismaLocation = (query: QueryLocationDto) => {
  let {
    page = 1,
    pageSize = 5,
    filters,
    ten_vi_tri,
    tinh_thanh,
    quoc_gia,
  } = query;

  const hasPagination =
    query.page !== undefined || query.pageSize !== undefined;

  page = Number(page);
  pageSize = Number(pageSize);

  if (!Number.isFinite(page) || page < 1) {
    page = 1;
  }

  if (!Number.isFinite(pageSize) || pageSize < 1) {
    pageSize = 5;
  }

  const skip = (page - 1) * pageSize;
  const where: any = {
    ...normalizeFilters(filters),
    isDeleted: false,
  };

  const tenViTriFilter = toContainsFilter(ten_vi_tri);
  if (tenViTriFilter) {
    where.ten_vi_tri = tenViTriFilter;
  }

  const tinhThanhFilter = toContainsFilter(tinh_thanh);
  if (tinhThanhFilter) {
    where.tinh_thanh = tinhThanhFilter;
  }

  const quocGiaFilter = toContainsFilter(quoc_gia);
  if (quocGiaFilter) {
    where.quoc_gia = quocGiaFilter;
  }

  return {
    page,
    pageSize,
    skip,
    take: pageSize,
    where,
    hasPagination,
  };
};
