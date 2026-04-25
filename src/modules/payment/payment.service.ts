import {prisma} from "../../lib/prisma";
import { stripe } from "../../config/stripe";


// bye movie 
export const buyMovie = async (
  userId: string,
  movieId: string
) => {
  const movie =
    await prisma.movie.findUnique({
      where: { id: movieId },
    });

  if (!movie) {
    throw new Error("Movie not found");
  }

  const session =
    await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: movie.title,
            },

            unit_amount:
              Number(movie.price) *
              100,
          },

          quantity: 1,
        },
      ],

      success_url:
        `${process.env.CLIENT_URL}/payment-success?title=${movie.slug}&session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${process.env.CLIENT_URL}/movie/${movie.slug}`,

      metadata: {
        userId,
        movieId,
        type: "PURCHASE",
      },
    });

  return {
    url: session.url,
  };
};


// get payment history for a user
export const checkMovieAccess = async (
  userId: string,
  movieId: string
) => {
  const payment =
    await prisma.payment.findFirst({
      where: {
        userId,
        movieId,
        status: "SUCCEEDED",
        type: "PURCHASE",
      },
    });

  return !!payment;
};


// after complete payment, save to db

// export const handleWebhook =
//   async (
//     body: any,
//     signature: any
//   ) => {
//     const endpointSecret =
//       process.env
//         .STRIPE_WEBHOOK_SECRET!;

//     const event =
//       stripe.webhooks.constructEvent(
//         body,
//         signature,
//         endpointSecret
//       );

//     if (
//       event.type ===
//       "checkout.session.completed"
//     ) {




//       const session = event.data.object;

//       const metadata = session.metadata || {};

//       const userId = metadata.userId;

//       const movieId = metadata.movieId;



//       const amount = (session.amount_total || 0) / 100;

//       await prisma.payment.create({
//         data: {
//           userId,
//           movieId,
//           amount,
//           currency: "usd",
//           status: "SUCCEEDED",
//           type: "PURCHASE",
//           stripePaymentId:
//             session.payment_intent as string,
//         },
//       });
//     }

//     return true;
//   };

// get payment history for a single user
export const getPaymentHistory = async (
  userId: string
) => {
  return await prisma.payment.findMany({
    where: { userId },
     include: {
        movie: true,
      },

    orderBy: {
      createdAt: "desc",
    },
  });
};






// get all payment history for admin
export const getAllPaymentHistory =
  async () => {
    return await prisma.payment.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },

        movie: {
          select: {
            title: true,
            poster: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  };