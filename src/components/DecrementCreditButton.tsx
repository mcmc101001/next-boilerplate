"use client";

import { decrementCredit } from "@/lib/actions/decrementCredit";
import Button from "./ui/Button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface DecrementCreditButtonProps {
  userId: string;
  creditDecrementCount: number;
}

export default function DecrementCreditButton({
  userId,
  creditDecrementCount,
}: DecrementCreditButtonProps) {
  const router = useRouter();

  return (
    <Button
      onClick={async () => {
        try {
          await decrementCredit(userId, creditDecrementCount);
          router.refresh();
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error?.message);
          } else {
            toast.error("Failed to decrement credit");
          }
        }
      }}
    >
      Decrement Credit
    </Button>
  );
}
