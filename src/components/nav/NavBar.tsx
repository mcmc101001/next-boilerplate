import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import LogoutButton from "@/components/nav/LogoutButton";
import UserProfilePic from "@/components/nav/UserProfilePic";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { Menu } from "lucide-react";
import LoginText from "@/components/nav/LoginText";
import LogoutText from "@/components/nav/LogoutText";
import LoginButton from "./LoginButton";
import { prisma } from "@/lib/prisma";
import RefreshButton from "../RefreshButton";

export const navOptions: Array<{
  name: string;
  href: string;
  authenticationRequired?: boolean;
}> = [
  {
    name: "Pricing",
    href: "/pricing",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    authenticationRequired: true,
  },
];

export default async function Navbar() {
  const user = await getCurrentUser();
  let credits: null | number | undefined = null;

  if (user) {
    const prismaUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    credits = prismaUser?.credits;
  }

  return (
    <>
      <nav className="hidden w-full items-center gap-x-10 px-16 md:flex">
        <Link href="/">
          <span className="font-semibold">AppName</span>
        </Link>
        {navOptions.map((option) => {
          if (option.authenticationRequired && !user) {
            return null;
          } else {
            return (
              <Link
                key={option.href}
                href={option.href}
                className="font-medium text-foreground/70 transition-colors duration-200 hover:text-foreground/100"
              >
                {option.name}
              </Link>
            );
          }
        })}
        <div className="ml-auto">
          {user ? (
            <div className="flex items-center gap-4">
              <RefreshButton />
              <span className="text-lg font-medium">{credits} credits</span>
              <UserProfilePic />
              <LogoutButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </nav>
      {/* Mobile navbar */}
      <div className="ml-auto md:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu className="text-foreground" />
          </SheetTrigger>
          <SheetContent className="w-fit text-foreground">
            <nav className="mt-5 flex flex-col items-end gap-y-4 pl-20 pr-12 text-xl">
              {navOptions.map((option) => (
                <Link key={option.href} href={option.href}>
                  {option.name}
                </Link>
              ))}
              {user ? (
                <>
                  <LogoutText />
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">
                      {credits} credits
                    </span>
                    <UserProfilePic />
                  </div>
                </>
              ) : (
                <LoginText />
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
