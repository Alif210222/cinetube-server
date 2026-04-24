
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

// 🔧 slug generate helper
const generateSlug = (title: string) =>
  title.toLowerCase().split(" ").join("-");

// ==========================
// ✅ CREATE MOVIE
// ==========================
export const createMovie = async (payload: any) => {
  const slug = generateSlug(payload.title);

  const existing = await prisma.movie.findUnique({
    where: { slug },
  });

  if (existing) {
    throw new AppError(400, "Movie already exists");
  }

  const movie = await prisma.movie.create({
    data: {
      ...payload,
      slug,
    },
  });

  return movie;
};

// ==========================
// ✅ GET ALL MOVIES
// ==========================
// export const getAllMovies = async (query: any) => {
//   const {
//     search,
//     genre,
//     platform,
//     minRating,
//     sortBy,
//     page = 1,
//     limit = 10,
//     priceType,
//     sortByPrice
//   } = query;

//   const skip = (Number(page) - 1) * Number(limit);

//    const where: any = {};
//    const andConditions: any[] = [];

//   // // 🔍 Search
//   // if (search) {
//   //   where.OR = [
//   //     { title: { contains: search, mode: "insensitive" } },
//   //     { director: { contains: search, mode: "insensitive" } },
//   //   ];
//   // }

//   // ==========================
//   // 🔍 SEARCH BY TITLE / DIRECTOR
//   // ==========================
//   if (search) {
//     andConditions.push({
//       OR: [
//         {
//           title: {
//             contains: search,
//             mode: "insensitive",
//           },
//         },
//         {
//           director: {
//             contains: search,
//             mode: "insensitive",
//           },
//         },
//       ],
//     });
//   }

//     // ==========================
//   // 🎭 GENRE FILTER
//   // ==========================
//   if (genre) {
//     andConditions.push({
//       genres: {
//         has: genre,
//       },
//     });
//   }

// // ==========================
//   // 💰 PRICE TYPE
//   // ==========================
//   if (priceType) {
//     andConditions.push({
//       priceType,
//     });
//   }

//   // ==========================
//   // 📺 PLATFORM FILTER
//   // ==========================
//   if (platform) {
//     andConditions.push({
//       platform: {
//         contains: platform,
//         mode: "insensitive",
//       },
//     });
//   }

// // ==========================
//   // ⭐ RATING FILTER
//   // ==========================
//   if (minRating) {
//     andConditions.push({
//       avgRating: {
//         gte: Number(minRating),
//       },
//     });
//   }





//   // 🔃 Sorting
//   let orderBy: any = { createdAt: "desc" };

//   if (sortBy === "rating") {
//     orderBy = { avgRating: "desc" };
//   }

//   if (sortBy === "reviews") {
//     orderBy = { totalReviews: "desc" };
//   }

//   if (priceType) {
//   where.priceType = "FREE";
// }


 

// // SORT BY ASSESNDING AND DESCENDING 
// // Price Low → High / High → Low
//   if (sortByPrice === "asc") {
//     orderBy = {
//       price: "asc",
//     };
//   }

//   if (sortByPrice === "desc") {
//     orderBy = {
//       price: "desc",
//     };
//   }

//   const movies = await prisma.movie.findMany({
//     where,
//     orderBy,
//     skip,
//     take: Number(limit),
//   });

//   const total = await prisma.movie.count({ where });

//   return {
//     meta: {
//       page: Number(page),
//       limit: Number(limit),
//       total,
//     },
//     data: movies,
//   };
// };
//-----------------------------------------------------
export const getAllMovies = async (query: any) => {
  const {
    search,
    genre,
    platform,
    minRating,
    sortBy,
    sortByPrice,
    priceType,
    page = 1,
    limit = 10,
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const andConditions: any[] = [];

  // ==========================
  // 🔍 SEARCH BY TITLE / DIRECTOR
  // ==========================
  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          director: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // ==========================
  // 🎭 GENRE FILTER
  // ==========================
  if (genre) {
    andConditions.push({
      genres: {
        has: genre,
      },
    });
  }

  // ==========================
  // 📺 PLATFORM FILTER
  // ==========================
  if (platform) {
    andConditions.push({
      platform: {
        contains: platform,
        mode: "insensitive",
      },
    });
  }

  // ==========================
  // ⭐ RATING FILTER
  // ==========================
  if (minRating) {
    andConditions.push({
      avgRating: {
        gte: Number(minRating),
      },
    });
  }

  // ==========================
  // 💰 PRICE TYPE
  // ==========================
  if (priceType) {
    andConditions.push({
      priceType,
    });
  }

  // ==========================
  // FINAL WHERE
  // ==========================
  const where =
    andConditions.length > 0
      ? { AND: andConditions }
      : {};

  // ==========================
  // SORTING
  // ==========================
  let orderBy: any = {
    createdAt: "desc",
  };

  if (sortBy === "rating") {
    orderBy = { avgRating: "desc" };
  }

  if (sortBy === "reviews") {
    orderBy = { totalReviews: "desc" };
  }

  if (sortByPrice === "asc") {
    orderBy = { price: "asc" };
  }

  if (sortByPrice === "desc") {
    orderBy = { price: "desc" };
  }

  // ==========================
  // QUERY
  // ==========================
  const movies = await prisma.movie.findMany({
    where,
    orderBy,
    skip,
    take: Number(limit),
  });

  const total = await prisma.movie.count({
    where,
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: movies,
  };
};




// ==========================
// ✅ GET SINGLE MOVIE
// ==========================
export const getSingleMovie = async (slug: string) => {
  const movie = await prisma.movie.findUnique({
    where: { slug },
    include: {
      reviews: true,
    },
  });

  if (!movie) {
    throw new AppError(404, "Movie not found");
  }

  return movie;
};

// ==========================
// ✅ UPDATE MOVIE
// ==========================
export const updateMovie = async (
  id: string,
  payload: any
) => {
  const movie = await prisma.movie.findUnique({
    where: { id },
  });

  if (!movie) {
    throw new AppError(404, "Movie not found");
  }

  const updated = await prisma.movie.update({
    where: { id },
    data: payload,
  });

  return updated;
};

// ==========================
// ✅ DELETE MOVIE
// ==========================
export const deleteMovie = async (id: string) => {
  const movie = await prisma.movie.findUnique({
    where: { id },
  });

  if (!movie) {
    throw new AppError(404, "Movie not found");
  }

  await prisma.movie.delete({
    where: { id },
  });

  return null;
};