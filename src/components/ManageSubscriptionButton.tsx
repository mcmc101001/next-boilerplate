"use client";

import Button from "@/components/ui/Button";
import { createPortalSessionSchemaType } from "@/pages/api/create-portal-session";

export default function ManageSubscriptionButton({
  user_id,
}: {
  user_id: string;
}) {
  const accessSubscriptionPage = async (user_id: string) => {
    const order: createPortalSessionSchemaType = {
      user_id: user_id,
    };
    const response = await fetch("/api/create-portal-session", {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = await response.json();
    window.location.href = body.url;
  };

  return (
    <button onClick={() => accessSubscriptionPage(user_id)}>
      Manage Subscription
    </button>
  );
}
