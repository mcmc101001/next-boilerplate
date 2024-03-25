import { env } from "@/env";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

// Get raw body as string
async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const creditMapper: {
  [price_id: string]: number;
} = {
  price_1Oxr5YP6F5ZxroDXeKGPIFlY: 10,
  price_1OxrENP6F5ZxroDXle1bu1t4: 30,
};

function calculateOrder(lineItems: Stripe.ApiList<Stripe.LineItem>) {
  const totalCredits = lineItems.data.reduce((acc, lineItem) => {
    const priceId = lineItem.price?.id;
    const quantity = lineItem.quantity;

    if (!priceId || !quantity) {
      return acc;
    }
    const credits = creditMapper[priceId];
    return acc + credits * quantity;
  }, 0);

  return totalCredits;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const sig = req.headers["stripe-signature"];
  if (!sig) {
    console.log("No signature");
    return res.status(400).send("No signature");
  }
  let event: Stripe.Event;

  const rawBody = await getRawBody(req);

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    if (err instanceof Error) {
      console.log("Webhook Error: ", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
    return;
  }

  if (event.type === "checkout.session.completed") {
    const sessionWithItems = await stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ["line_items"],
      },
    );

    const metadata = sessionWithItems.metadata as sessionMetadata;
    const lineItems = sessionWithItems.line_items;
    const credits = lineItems ? calculateOrder(lineItems) : 0;
    const userId = metadata.user_id;

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        credits: {
          increment: credits,
        },
      },
    });
  }

  res.status(200).end();
}
