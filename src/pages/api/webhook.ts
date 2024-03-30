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

  let subscription: Stripe.Subscription;
  let status: Stripe.Subscription.Status;
  let metadata: sessionMetadata;
  let customerId: string;

  switch (event.type) {
    case "checkout.session.completed":
      const sessionWithItems = await stripe.checkout.sessions.retrieve(
        event.data.object.id,
        {
          expand: ["line_items"],
        },
      );

      if (sessionWithItems.mode === "subscription") {
        break;
      }

      metadata = sessionWithItems.metadata as sessionMetadata;
      const lineItems = sessionWithItems.line_items;
      const credits = lineItems ? calculateOrder(lineItems) : 0;
      const userId = metadata.user_id;

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          credits: {
            increment: credits,
          },
        },
      });
      break;

    case "customer.subscription.deleted":
      subscription = event.data.object;
      status = subscription.status;
      metadata = subscription.metadata as sessionMetadata;

      await prisma.user.update({
        where: {
          id: metadata.user_id,
        },
        data: {
          subscribed: false,
        },
      });

      // Then define and call a method to handle the subscription deleted.
      // handleSubscriptionDeleted(subscriptionDeleted);
      break;

    case "customer.subscription.created":
      subscription = event.data.object;
      status = subscription.status;
      metadata = subscription.metadata as sessionMetadata;
      customerId = subscription.customer as string;

      if (status === "active" || status === "trialing") {
        await prisma.user.update({
          where: {
            id: metadata.user_id,
          },
          data: {
            subscribed: true,
            stripeCustomerId: customerId,
          },
        });
      }
      break;

    case "customer.subscription.updated":
      subscription = event.data.object;
      status = subscription.status;
      metadata = subscription.metadata as sessionMetadata;
      customerId = subscription.customer as string;

      if (
        status === "canceled" ||
        status === "unpaid" ||
        status === "incomplete" ||
        status === "incomplete_expired" ||
        status === "past_due" ||
        status === "paused"
      ) {
        await prisma.user.update({
          where: {
            id: metadata.user_id,
          },
          data: {
            subscribed: false,
          },
        });
      } else if (status === "active") {
        await prisma.user.update({
          where: {
            id: metadata.user_id,
          },
          data: {
            subscribed: true,
            stripeCustomerId: customerId,
          },
        });
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.status(200).end();
}
