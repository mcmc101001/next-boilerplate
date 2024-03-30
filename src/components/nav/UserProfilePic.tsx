import { getCurrentUser } from "@/lib/session";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ManageSubscriptionButton from "../ManageSubscriptionButton";

async function UserProfilePic() {
  const user = await getCurrentUser();

  return (
    <>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Image
              loading="lazy"
              src={user.image!}
              alt={user.name ?? "profile image"}
              referrerPolicy="no-referrer"
              width={40}
              height={40}
              className="rounded-xl"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ManageSubscriptionButton user_id={user.id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}

export default UserProfilePic;
