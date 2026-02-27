import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../services/prisma';

async function run() {
  const password = await bcrypt.hash('Password123!', 10);

  const company = await prisma.companies.upsert({
    where: { id: 'demo-company' },
    update: {},
    create: { id: 'demo-company', name: 'Demo Client Co', status: 'active' }
  });

  const baseUsers: Array<[string, string, 'ADMIN' | 'FINANCE' | 'PM' | 'DEVELOPER' | 'CLIENT']> = [
    ['admin@molecule.dev', 'Admin', 'ADMIN'],
    ['finance@molecule.dev', 'Finance', 'FINANCE'],
    ['pm@molecule.dev', 'Project Manager', 'PM'],
    ['dev1@molecule.dev', 'Developer One', 'DEVELOPER'],
    ['dev2@molecule.dev', 'Developer Two', 'DEVELOPER'],
    ['client@molecule.dev', 'Demo Client', 'CLIENT']
  ];

  const users = [] as any[];
  for (const [email, name, role] of baseUsers) {
    const user = await prisma.users.upsert({
      where: { email },
      update: { name, role, companyId: company.id, status: 'active' },
      create: { email, name, role, password, companyId: company.id, status: 'active' }
    });
    users.push(user);
  }

  const client = users.find((u) => u.role === 'CLIENT');
  const dev = users.find((u) => u.role === 'DEVELOPER');

  const requirement = await prisma.requirements.upsert({
    where: { id: 'demo-requirement' },
    update: {},
    create: {
      id: 'demo-requirement',
      title: 'Build client portal',
      description: 'Create a complete project delivery portal with milestone tracking.',
      budgetRange: '$8,000-$12,000',
      deadline: new Date(Date.now() + 45 * 24 * 3600 * 1000),
      priority: 'High',
      status: 'quoted',
      workflow: 'payment_pending',
      companyId: company.id
    }
  });

  const quotation = await prisma.quotations.upsert({
    where: { requirementId: requirement.id },
    update: {},
    create: {
      requirementId: requirement.id,
      lineItems: [{ name: 'Discovery', amount: 2000 }, { name: 'Development', amount: 7000 }, { name: 'UAT', amount: 1000 }] as any,
      total: 10000,
      status: 'Accepted'
    }
  });

  const invoice = await prisma.invoices.upsert({
    where: { quotationId: quotation.id },
    update: { status: 'Payment Pending' },
    create: {
      quotationId: quotation.id,
      invoiceNumber: 'INV-DEMO-001',
      amount: 10000,
      status: 'Payment Pending'
    }
  });

  const project = await prisma.projects.upsert({
    where: { invoiceId: invoice.id },
    update: { status: 'In Progress', progress: 55 },
    create: { invoiceId: invoice.id, name: 'Demo Client Portal', clientId: client.id, status: 'In Progress', progress: 55 }
  });

  const milestone = await prisma.milestones.upsert({
    where: { id: 'demo-milestone' },
    update: { status: 'In Progress' },
    create: {
      id: 'demo-milestone',
      projectId: project.id,
      title: 'Build core workflow engine',
      dueDate: new Date(Date.now() + 10 * 24 * 3600 * 1000),
      status: 'In Progress'
    }
  });

  await prisma.tasks.upsert({
    where: { id: 'demo-task' },
    update: { status: 'In Progress', assigneeId: dev.id, timeLogHours: 6 },
    create: {
      id: 'demo-task',
      milestoneId: milestone.id,
      assigneeId: dev.id,
      title: 'Implement invoice verification endpoint',
      description: 'Add finance verify/reject with notes and transition handling',
      timeLogHours: 6,
      status: 'In Progress'
    }
  });

  await prisma.notifications.create({
    data: { userId: client.id, title: 'Invoice Pending', body: 'Your demo invoice INV-DEMO-001 is waiting for receipt upload.', status: 'new' }
  });

  console.log('Seed complete. Password for all users: Password123!');
}

run().finally(async () => {
  await prisma.$disconnect();
});
