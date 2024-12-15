import { type Prisma, PrismaClient, type Auditor } from "@prisma/client";

const prisma = new PrismaClient();

interface UpdateProfileInput {
  auditorId: number;
  name?: string;
  teamName?: string;
  role?: string;
  profilePictureUrl?: string;
}

export async function updateAuditorProfile({
  auditorId,
  name,
  teamName,
  role,
  profilePictureUrl,
}: UpdateProfileInput) {
  const updatedAuditor = await prisma.auditor.update({
    where: { id: auditorId },
    data: {
      ...(name && { name }),
      ...(teamName && { teamName }),
      ...(role && { role }),
      ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
    },
  });
  return updatedAuditor;
}

export async function getAuditorById(auditorId: number) {
  return prisma.auditor.findUnique({
    where: { id: auditorId },
    select: {
      id: true,
      name: true,
      email: true,
      teamName: true,
      role: true,
      profilePicture: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
