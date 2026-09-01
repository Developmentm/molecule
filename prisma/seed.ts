import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@lawfirm.test" },
    update: {},
    create: {
      name: "Firm Admin",
      email: "admin@lawfirm.test",
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.firmSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      firmName: "Sharma & Associates",
      address: "12 MG Road, New Delhi",
      phone: "+91 98765 43210",
      email: "contact@sharmalaw.test",
      defaultRate: 2500,
      invoicePrefix: "INV",
    },
  });

  const location = await prisma.location.upsert({
    where: { id: "loc-seed-1" },
    update: {},
    create: { id: "loc-seed-1", name: "Delhi HQ", address: "12 MG Road, New Delhi" },
  });

  const existingHolidays = await prisma.holiday.count();
  if (existingHolidays === 0) {
    await prisma.holiday.createMany({
      data: [
        { name: "Republic Day", date: new Date("2026-01-26") },
        { name: "Independence Day", date: new Date("2026-08-15") },
        { name: "Diwali", date: new Date("2026-11-08") },
      ],
    });
  }

  const lawyer = await prisma.lawyer.upsert({
    where: { email: "rakesh.sharma@lawfirm.test" },
    update: {},
    create: {
      name: "Rakesh Sharma",
      email: "rakesh.sharma@lawfirm.test",
      phone: "+91 90000 00001",
      barNumber: "D/1234/2010",
      designation: "PARTNER",
      hourlyRate: 5000,
      inCharge: true,
      userId: adminUser.id,
    },
  });

  const lawyer2 = await prisma.lawyer.upsert({
    where: { email: "priya.mehta@lawfirm.test" },
    update: {},
    create: {
      name: "Priya Mehta",
      email: "priya.mehta@lawfirm.test",
      phone: "+91 90000 00002",
      barNumber: "D/5678/2015",
      designation: "LAWYER",
      hourlyRate: 2500,
    },
  });

  const client = await prisma.client.upsert({
    where: { id: "client-seed-1" },
    update: {},
    create: {
      id: "client-seed-1",
      name: "Ashok Enterprises Pvt Ltd",
      email: "contact@ashokent.test",
      phone: "+91 98111 22333",
      company: "Ashok Enterprises Pvt Ltd",
      address: "45 Nehru Place, New Delhi",
    },
  });

  const matter = await prisma.matter.upsert({
    where: { caseNumber: "CASE-2026-001" },
    update: {},
    create: {
      caseNumber: "CASE-2026-001",
      title: "Ashok Enterprises vs. State Trade Board",
      description: "Commercial dispute regarding trade license renewal.",
      status: "OPEN",
      clientId: client.id,
      locationId: location.id,
      billingRate: 3000,
      lawyers: {
        create: [{ lawyerId: lawyer.id }, { lawyerId: lawyer2.id }],
      },
    },
  });

  await prisma.timeRecord.createMany({
    data: [
      {
        matterId: matter.id,
        lawyerId: lawyer.id,
        hours: 3.5,
        rate: 5000,
        description: "Drafting reply to show-cause notice",
        billable: true,
      },
      {
        matterId: matter.id,
        lawyerId: lawyer2.id,
        hours: 2,
        rate: 2500,
        description: "Research on trade license precedents",
        billable: true,
      },
    ],
  });

  await prisma.disbursement.create({
    data: {
      matterId: matter.id,
      description: "Court filing fees",
      amount: 1500,
    },
  });

  console.log("Seed complete. Login: admin@lawfirm.test / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
