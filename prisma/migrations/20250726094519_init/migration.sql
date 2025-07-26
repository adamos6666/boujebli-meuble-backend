-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProduitStandard" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "langues" TEXT[],

    CONSTRAINT "ProduitStandard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemandeSurMesure" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "image" TEXT,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "DemandeSurMesure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Traduction" (
    "id" SERIAL NOT NULL,
    "cle" TEXT NOT NULL,
    "valeur" TEXT NOT NULL,
    "langue" TEXT NOT NULL,

    CONSTRAINT "Traduction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "DemandeSurMesure" ADD CONSTRAINT "DemandeSurMesure_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
