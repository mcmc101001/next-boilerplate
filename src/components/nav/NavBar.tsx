import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import LogoutButton from "@/components/nav/LogoutButton";
import UserProfilePic from "@/components/nav/UserProfilePic";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { Menu } from "lucide-react";
import LoginText from "@/components/nav/LoginText";
import LogoutText from "@/components/nav/LogoutText";
import LoginButton from "./LoginButton";

export const navOptions: Array<{
  name: string;
  href: string;
}> = [
  {
    name: "Pricing",
    href: "/pricing",
  },
];

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <>
      <nav className="hidden md:flex px-16 w-full gap-x-10 items-center">
        <span className="font-semibold">AppName</span>
        {navOptions.map((option) => (
          <Link
            key={option.href}
            href={option.href}
            className="font-medium text-foreground/70 hover:text-foreground/100 transition-colors duration-200"
          >
            {option.name}
          </Link>
        ))}
        <div className="ml-auto">
          {user ? (
            <div className="flex gap-4">
              <UserProfilePic />
              <LogoutButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </nav>
      {/* Mobile navbar */}
      <div className="md:hidden ml-auto">
        <Sheet>
          <SheetTrigger>
            <Menu className="text-foreground" />
          </SheetTrigger>
          <SheetContent className="w-fit text-foreground">
            <nav className="mt-5 flex flex-col items-end gap-y-4 pl-28 pr-12 text-xl">
              {navOptions.map((option) => (
                <Link key={option.href} href={option.href}>
                  {option.name}
                </Link>
              ))}
              {user ? <LogoutText /> : <LoginText />}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
