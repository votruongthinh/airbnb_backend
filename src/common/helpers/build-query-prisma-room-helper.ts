import { QueryRoomDto } from '../../modules-api/room/dto/query-room.dto';

export const buildQueryPrismaRoom = (query: QueryRoomDto) => {
    let {
        page = 1,
        pageSize = 5,
        ten_phong,
        minPrice,
        maxPrice,
        khach,
        phong_ngu,
        phong_tam,
        giuong,
        id_vi_tri,
        vi_tri_Id,
        ...rest
    } = query;

    const hasPagination =
        query.page !== undefined || query.pageSize !== undefined;

    // 📄 Pagination
    page = Number(page);
    pageSize = Number(pageSize);

    if (!Number.isFinite(page) || page < 1) page = 1;
    if (!Number.isFinite(pageSize) || pageSize < 1) pageSize = 5;

    const skip = (page - 1) * pageSize;
    const locationId = id_vi_tri ?? vi_tri_Id;

    const where: any = {
        isDeleted: false,
    };

    // 🔍 SEARCH
    const roomName = ten_phong?.trim();
    if (roomName) {
        where.ten_phong = {
            contains: roomName,
        };
    }

    // 💰 FILTER GIÁ
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.gia_tien = {};
        if (minPrice !== undefined) where.gia_tien.gte = minPrice;
        if (maxPrice !== undefined) where.gia_tien.lte = maxPrice;
    }

    // 👥 KHÁCH
    if (khach !== undefined) {
        where.khach = { gte: khach };
    }

    // 🛏 PHÒNG
    if (phong_ngu !== undefined) {
        where.phong_ngu = { gte: phong_ngu };
    }

    if (phong_tam !== undefined) {
        where.phong_tam = { gte: phong_tam };
    }

    if (giuong !== undefined) {
        where.giuong = { gte: giuong };
    }

    // 📍 VỊ TRÍ
    if (locationId !== undefined) {
        where.vi_tri_Id = locationId;
    }

    // 🏠 TIỆN NGHI (FIX TYPE Ở ĐÂY 🔥)
    const booleanFields = [
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

    booleanFields.forEach((field) => {
        if (rest[field] !== undefined) {
            where[field] = rest[field];
        }
    });

    return {
        skip,
        take: pageSize,
        where,
        hasPagination,
        page,
        pageSize,
    };
};
