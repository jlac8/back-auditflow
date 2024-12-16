import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createAudit({
  auditorId,
  leaderName,
  auditName,
  period,
}: {
  auditorId: number;
  leaderName: string;
  auditName: string;
  period: string;
}) {
  const newAudit = await prisma.audit.create({
    data: {
      leaderName,
      auditName,
      period,
      auditorId,
    },
  });
  return newAudit;
}

export async function getAuditsByAuditor(auditorId: number) {
  const audits = await prisma.audit.findMany({
    where: { auditorId },
    orderBy: { createdAt: "desc" },
  });
  return audits;
}

export async function deleteAudit(auditId: number, auditorId: number) {
  const audit = await prisma.audit.findUnique({
    where: { id: auditId },
  });

  if (!audit || audit.auditorId !== auditorId) {
    throw new Error("Auditoría no encontrada");
  }

  await prisma.audit.delete({
    where: { id: auditId },
  });

  return audit;
}
