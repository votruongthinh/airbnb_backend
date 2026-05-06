import type { Prisma } from 'src/modules-system/prisma/generated/prisma/client.js';
import {
  roomBooleanFields,
  type PaginationState,
  type RoomBooleanField,
  type RoomQueryInput,
  type RoomWhereInput,
} from '../types/room-query.types';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 5;

export const normalizeRoomPagination = (
  query: Pick<RoomQueryInput, 'page' | 'pageSize'>,
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

export const buildRoomWhere = (query: RoomQueryInput): RoomWhereInput => {
  const where = { isDeleted: false } as RoomWhereInput;
  const booleanWhere = where as unknown as Record<
    RoomBooleanField,
    boolean | null | undefined
  >;

  const roomName = query.ten_phong?.trim();
  if (roomName) {
    where.ten_phong = { contains: roomName };
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    const priceFilter: Prisma.DecimalFilter<'Phong'> = {};
    if (query.minPrice !== undefined) priceFilter.gte = query.minPrice;
    if (query.maxPrice !== undefined) priceFilter.lte = query.maxPrice;
    where.gia_tien = priceFilter;
  }

  if (query.khach !== undefined) {
    where.khach = { gte: query.khach };
  }

  if (query.phong_ngu !== undefined) {
    where.phong_ngu = { gte: query.phong_ngu };
  }

  if (query.phong_tam !== undefined) {
    where.phong_tam = { gte: query.phong_tam };
  }

  if (query.giuong !== undefined) {
    where.giuong = { gte: query.giuong };
  }

  if (query.id_vi_tri !== undefined) {
    where.vi_tri_Id = query.id_vi_tri;
  }

  roomBooleanFields.forEach((field) => {
    const value = query[field];

    if (value !== undefined) {
      booleanWhere[field] = value;
    }
  });

  return where;
};
