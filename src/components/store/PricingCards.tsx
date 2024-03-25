"use client";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import type { MouseEvent } from "react";
import Button from "../ui/Button";
import { orderType } from "@/pages/api/checkout_session";

type Card = {
  title: string;
  description: string;
  price: string;
  price_id: string;
};

const cards: Card[] = [
  {
    title: "Basic",
    description: "10 credits",
    price: "$5.00",
    price_id: "price_1Oxr5YP6F5ZxroDXeKGPIFlY",
  },
  {
    title: "Pro",
    description: "30 credits",
    price: "$10.00",
    price_id: "price_1OxrENP6F5ZxroDXle1bu1t4",
  },
  {
    title: "Enterprise",
    description: "50 credits",
    price: "$10.00",
    price_id: "price_1OxrENP6F5ZxroDXle1bu1t4",
  },
];

export default function PricingCards() {
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-between gap-8">
      {cards.map((card) => {
        return <Card key={card.title} card={card} />;
      })}
    </div>
  );
}

interface CardProps {
  card: Card;
}

function Card({ card }: CardProps) {
  const { title, description, price, price_id } = card;

  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ clientX, clientY, currentTarget }: MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  async function handlePayment() {
    const order: orderType = {
      price_id: price_id,
    };
    const response = await fetch("/api/checkout_session", {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = await response.json();
    window.location.href = body.url;
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group/card relative h-full w-full rounded-lg bg-card px-5 pb-5 pt-3 text-card-foreground md:w-96 md:p-8 md:pt-5"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition duration-300 group-hover/card:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, hsl(0, 0%, 70%, 0.15), transparent)`,
        }}
      />
      <div className="flex h-full w-full flex-col gap-y-3">
        <h1 className="mt-2 text-2xl font-medium md:text-3xl">{title}</h1>
        <p className="text-3xl font-semibold md:text-4xl">{price}</p>
        <p className="text-sm text-card-foreground/70 md:text-base">
          {description}
        </p>
        <Button
          variant="secondary"
          className="mt-auto w-full text-sm md:text-lg"
          onClick={handlePayment}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
