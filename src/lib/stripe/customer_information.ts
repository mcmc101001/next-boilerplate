import { env } from "@/env";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export default async function getCustomerInformation(session_id: string) {
  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["customer"],
    });
    if (!stripeSession.customer) {
      throw new Error("Error with Stripe session retrieval.");
    } else {
      return stripeSession.customer;
    }
  } catch (error) {
    throw new Error("Error with Stripe session retrieval.");
  }
}
