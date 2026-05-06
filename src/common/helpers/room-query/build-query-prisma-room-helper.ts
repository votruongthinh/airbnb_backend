import type { QueryRoomDto } from 'src/modules-api/room/dto/query-room.dto';
import {
  buildRoomWhere,
  normalizeRoomPagination,
} from './utils';

export const buildQueryPrismaRoom = (query: QueryRoomDto) => {
  const { page, pageSize, skip, take, hasPagination } =
    normalizeRoomPagination(query);

  return {
    page,
    pageSize,
    skip,
    take,
    where: buildRoomWhere(query),
    hasPagination,
  };
};
