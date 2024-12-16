-- CreateTable
CREATE TABLE "auditors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "teamName" TEXT,
    "role" TEXT,
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auditors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audits" (
    "id" SERIAL NOT NULL,
    "leaderName" TEXT NOT NULL,
    "auditName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Activa',
    "period" TEXT NOT NULL,
    "auditorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_matrices" (
    "id" SERIAL NOT NULL,
    "risk" TEXT NOT NULL,
    "control" TEXT NOT NULL,
    "reviewInfo" TEXT NOT NULL,
    "auditId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "risk_matrices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "walkthroughs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "auditId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "walkthroughs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auditors_email_key" ON "auditors"("email");

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_auditorId_fkey" FOREIGN KEY ("auditorId") REFERENCES "auditors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_matrices" ADD CONSTRAINT "risk_matrices_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "walkthroughs" ADD CONSTRAINT "walkthroughs_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
