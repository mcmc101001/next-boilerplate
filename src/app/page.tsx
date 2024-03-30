import ManageSubscriptionButton from "@/components/ManageSubscriptionButton";
import { InfiniteMovingCardsLanding } from "@/components/landing/InfiniteMovingCardsLanding";
import MagicButton from "@/components/ui/MagicButton";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export default async function Home() {
  const user = await getCurrentUser();

  const prismaUser = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  return (
    <>
      <section className="container mt-20 flex h-full flex-col items-center justify-center gap-6 py-10 text-foreground md:max-w-[70vw] md:gap-12">
        <h1 className="text-5xl font-bold md:text-7xl">Catchphrase</h1>
        <p className="text-base md:text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <MagicButton className="h-full w-fit text-lg md:text-xl">
          Try it now!
        </MagicButton>
        {user && prismaUser && prismaUser.subscribed && (
          <ManageSubscriptionButton user_id={user?.id} />
        )}
      </section>
      <section className="container mt-20 flex h-full flex-col items-center justify-center gap-6 py-10 text-foreground md:max-w-[70vw] md:gap-12">
        <InfiniteMovingCardsLanding />
      </section>
    </>
  );
}
