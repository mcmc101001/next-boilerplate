import { env } from "@/env";
import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isValidBody } from "@/lib/utils";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const orderSchema = z.object({
  price_id: z.string(),
  type: z.union([z.literal("payment"), z.literal("subscription")]),
});

export type orderType = z.infer<typeof orderSchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (!isValidBody(req.body, orderSchema)) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const { price_id, type } = req.body;

  const stripeMetadata: sessionMetadata = {
    user_id: session.user.id,
  };

  try {
    let stripeSession: Stripe.Checkout.Session;
    if (type === "subscription") {
      stripeSession = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: `${price_id}`,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: "http://localhost:3000/success/{CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000",
        subscription_data: {
          metadata: stripeMetadata,
        },
      });
    } else if (type === "payment") {
      stripeSession = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: `${price_id}`,
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_creation: "always",
        success_url: "http://localhost:3000/success/{CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000",
        metadata: stripeMetadata,
      });
    } else {
      res.status(400).json("Order type not supported in API.");
      return;
    }
    if (!stripeSession.url) {
      res.status(500).json("Error with Stripe checkout session creation.");
    } else {
      res.json({ url: stripeSession.url });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Error with Stripe checkout session creation.");
  }
}
