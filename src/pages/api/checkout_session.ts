import { env } from "@/env";
import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isValidBody } from "@/lib/utils";
import Stripe from "stripe";

// This is your test secret API key.
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const orderSchema = z.object({
  price_id: z.string(),
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

  const { price_id } = req.body;

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: `${price_id}`,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000",
      cancel_url: "http://localhost:3000",
    });
    if (!stripeSession.url) {
      res.status(500).json("Error with Stripe checkout session creation.");
    } else {
      res.json({ url: stripeSession.url });
    }
  } catch (error) {
    res.status(500).json("Error with Stripe checkout session creation.");
  }
}
