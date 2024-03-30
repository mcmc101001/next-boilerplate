"use client";

import { InfiniteMovingCards } from "@/components/ui/infitnite-moving-cards";

export function InfiniteMovingCardsLanding() {
  return (
    <div className="relative flex h-[40rem] flex-col items-center justify-center overflow-hidden rounded-md bg-background antialiased">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote: "Extremely inituitive to use!",
    name: "Max",
    title: "Software Developer",
  },
  {
    quote: "This is the best tool for quick iterations of designs!",
    name: "Max",
    title: "Indie Hacker",
  },
];
