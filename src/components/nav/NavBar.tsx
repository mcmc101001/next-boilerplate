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
      <nav className="hidden w-full items-center gap-x-10 px-16 md:flex">
        <span className="font-semibold">AppName</span>
        {navOptions.map((option) => (
          <Link
            key={option.href}
            href={option.href}
            className="font-medium text-foreground/70 transition-colors duration-200 hover:text-foreground/100"
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
      <div className="ml-auto md:hidden">
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
