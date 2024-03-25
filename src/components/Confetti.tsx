"use client";

import useWindowDimensions from "@/hooks/useWindowsDimensions";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

const DURATION = 3000;

export default function ConfettiComponent() {
  const { width, height } = useWindowDimensions();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowConfetti(false);
    }, DURATION);
  });

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={showConfetti ? 200 : 0}
    />
  );
}
