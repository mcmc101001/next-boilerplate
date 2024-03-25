import Button from "@/components/ui/Button";
import getCustomerInformation from "@/lib/stripe/customer_information";
import Link from "next/link";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

const ConfettiComponentNoSSR = dynamic(() => import("@/components/Confetti"), {
  ssr: false,
});

export default async function SuccessPage({
  params,
}: {
  params: { sessionId: string };
}) {
  let customerName = "";
  try {
    const customer = await getCustomerInformation(params.sessionId);
    if (typeof customer !== "string" && "name" in customer && customer.name) {
      customerName = customer.name;
    }
  } catch (error) {
    notFound();
  }
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-12">
      <ConfettiComponentNoSSR />
      <h1 className="text-6xl font-semibold">Success!</h1>
      <p className="text-3xl">Thank you for your purchase {customerName}.</p>
      <Link href="/">
        <Button className="text-xl">Return</Button>
      </Link>
    </div>
  );
}
