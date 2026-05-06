import type { QueryLocationDto } from 'src/modules-api/location/dto/query-location.dto';
import {
  buildLocationWhere,
  normalizeLocationPagination,
} from './utils';

export const buildQueryPrismaLocation = (query: QueryLocationDto) => {
  const { page, pageSize, skip, take, hasPagination } =
    normalizeLocationPagination(query);

  return {
    page,
    pageSize,
    skip,
    take,
    where: buildLocationWhere(query),
    hasPagination,
  };
};
