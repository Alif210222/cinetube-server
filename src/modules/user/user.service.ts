import { prisma } from "../../lib/prisma";


export const getAllUsers = async (
  query: any
) => {
  const {
    page = 1,
    limit = 10,
    search,
    role,
  } = query;

  const skip =
    (Number(page) - 1) * Number(limit);

  const where: any = {};

  // search name/email
  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  // filter by role
  if (role) {
    where.role = role;
  }

  const users =
    await prisma.user.findMany({
      where,

      skip,

      take: Number(limit),

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        membershipStatus: true,
        createdAt: true,
      },
    });

  const total =
    await prisma.user.count({
      where,
    });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(
        total / Number(limit)
      ),
    },

    data: users,
  };
};