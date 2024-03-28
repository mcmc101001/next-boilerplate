"use client";

import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";

export default function RefreshButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.refresh()}>
      <RefreshCw />
    </Button>
  );
}
