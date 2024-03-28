"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function decrementCredit(userId: string, creditCount: number) {
  const session = await getServerSession();
  if (!session) {
    throw new Error(`User not authenticated!`);
  }

  const prismaUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!prismaUser) {
    throw new Error(`User not found!`);
  }
  if (prismaUser.credits < creditCount) {
    throw new Error(`User does not have enough credits!`);
  }
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      credits: {
        decrement: creditCount,
      },
    },
  });
}
