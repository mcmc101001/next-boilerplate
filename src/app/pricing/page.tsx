import PricingCards from "@/components/store/PricingCards";

export default function PricingPage() {
  return (
    <div className="flex flex-col items-center justify-center pt-12">
      <h1 className="mb-8 text-4xl font-bold">Pricing</h1>
      <PricingCards />
    </div>
  );
}
