import type { Prisma } from 'src/modules-system/prisma/generated/prisma/client.js';

export const roomBooleanFields = [
  'may_giat',
  'ban_la',
  'ti_vi',
  'dieu_hoa',
  'wifi',
  'bep',
  'do_xe',
  'ho_boi',
  'ban_ui',
] as const;

export type RoomBooleanField = (typeof roomBooleanFields)[number];

export type RoomQueryInput = {
  page?: number;
  pageSize?: number;
  ten_phong?: string;
  minPrice?: number;
  maxPrice?: number;
  khach?: number;
  phong_ngu?: number;
  phong_tam?: number;
  giuong?: number;
  id_vi_tri?: number;
  may_giat?: boolean;
  ban_la?: boolean;
  ti_vi?: boolean;
  dieu_hoa?: boolean;
  wifi?: boolean;
  bep?: boolean;
  do_xe?: boolean;
  ho_boi?: boolean;
  ban_ui?: boolean;
};

export type RoomWhereInput = Prisma.PhongWhereInput;

export type PaginationState = {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
  hasPagination: boolean;
};
