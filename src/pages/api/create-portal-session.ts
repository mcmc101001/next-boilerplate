import { env } from "@/env";
import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isValidBody } from "@/lib/utils";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const createPortalSessionSchema = z.object({
  user_id: z.string(),
});

export type createPortalSessionSchemaType = z.infer<
  typeof createPortalSessionSchema
>;

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

  if (session.user.id !== req.body.user_id) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  if (!isValidBody(req.body, createPortalSessionSchema)) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const { user_id } = req.body;

  try {
    const returnUrl = "http://localhost:3000";

    const prismaUser = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!prismaUser) {
      res.status(404).json("User not found.");
      return;
    }

    const stripeCustomerId = prismaUser.stripeCustomerId;

    if (!stripeCustomerId) {
      res.status(404).json("Stripe customer id not found.");
      return;
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });

    if (!portalSession.url) {
      res.status(500).json("Error with Stripe portal session creation.");
    } else {
      res.json({ url: portalSession.url });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Error with Stripe portal session creation.");
  }
}
