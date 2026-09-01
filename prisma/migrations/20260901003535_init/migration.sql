-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SUBADMIN',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Holiday" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Lawyer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "barNumber" TEXT,
    "designation" TEXT NOT NULL DEFAULT 'LAWYER',
    "hourlyRate" REAL NOT NULL DEFAULT 0,
    "inCharge" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lawyer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "company" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Matter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "clientId" TEXT NOT NULL,
    "locationId" TEXT,
    "openDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closeDate" DATETIME,
    "billingRate" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Matter_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Matter_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatterLawyer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matterId" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,
    CONSTRAINT "MatterLawyer_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MatterLawyer_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "Lawyer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TimeRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matterId" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hours" REAL NOT NULL,
    "rate" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "billable" BOOLEAN NOT NULL DEFAULT true,
    "invoiced" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TimeRecord_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TimeRecord_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "Lawyer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Disbursement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matterId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "invoiced" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Disbursement_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "matterId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "rate" REAL NOT NULL,
    "amount" REAL NOT NULL,
    "timeRecordId" TEXT,
    "disbursementId" TEXT,
    CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InvoiceItem_timeRecordId_fkey" FOREIGN KEY ("timeRecordId") REFERENCES "TimeRecord" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InvoiceItem_disbursementId_fkey" FOREIGN KEY ("disbursementId") REFERENCES "Disbursement" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Leave" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lawyerId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Casual',
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Leave_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "Lawyer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FirmSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "firmName" TEXT NOT NULL DEFAULT 'My Law Firm',
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "defaultRate" REAL NOT NULL DEFAULT 0,
    "invoicePrefix" TEXT NOT NULL DEFAULT 'INV'
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lawyer_email_key" ON "Lawyer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lawyer_userId_key" ON "Lawyer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Matter_caseNumber_key" ON "Matter"("caseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MatterLawyer_matterId_lawyerId_key" ON "MatterLawyer"("matterId", "lawyerId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceItem_timeRecordId_key" ON "InvoiceItem"("timeRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceItem_disbursementId_key" ON "InvoiceItem"("disbursementId");
