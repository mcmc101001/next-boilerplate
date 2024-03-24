import { getCurrentUser } from "@/lib/session";
import Image from "next/image";
import LogoutButton from "@/components/nav/LogoutButton";
import LoginButton from "@/components/nav/LoginButton";
import Link from "next/link";

async function UserProfilePic() {
  const user = await getCurrentUser();
  return (
    <>
      {user && (
        <Image
          loading="lazy"
          src={user.image!}
          alt={user.name ?? "profile image"}
          referrerPolicy="no-referrer"
          width={40}
          height={40}
          className="rounded-xl"
        />
      )}
    </>
  );
}

export default UserProfilePic;
