import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { z } from 'zod';
import { authGuard } from '../middleware/auth';
import { canTransition } from '../types/workflow';
import { prisma } from '../services/prisma';
import { buildPdf } from '../services/pdf';
import { sendMockEmail } from '../services/email';

const router = Router();

const upload = multer({
  dest: path.join(process.cwd(), 'uploads'),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', authGuard(['FINANCE', 'ADMIN']), async (req, res) => {
  const body = z.object({ quotationId: z.string() }).parse(req.body);
  const quotation = await prisma.quotations.findUniqueOrThrow({ where: { id: body.quotationId }, include: { requirement: { include: { company: { include: { users: true } } } } } });
  if (!canTransition(quotation.requirement.workflow as any, 'invoice_sent')) {
    return res.status(400).json({ message: `Invalid workflow transition from ${quotation.requirement.workflow} to invoice_sent` });
  }
  const invoice = await prisma.invoices.create({
    data: { quotationId: quotation.id, amount: quotation.total, invoiceNumber: `INV-${Date.now()}`, status: 'Sent' }
  });
  await prisma.requirements.update({ where: { id: quotation.requirementId }, data: { workflow: 'invoice_sent' } });

  const client = quotation.requirement.company.users.find((u) => u.role === 'CLIENT');
  if (client) {
    await prisma.notifications.create({ data: { userId: client.id, title: 'Invoice Sent', body: `Invoice ${invoice.invoiceNumber} sent`, status: 'new' } });
    await sendMockEmail(client.email, 'Invoice Sent', `Invoice ${invoice.invoiceNumber} amount ${invoice.amount}`);
  }

  return res.json(invoice);
});

router.post('/:id/receipt', authGuard(['CLIENT']), upload.single('file'), async (req, res) => {
  const body = z.object({ referenceNumber: z.string().min(3) }).parse(req.body);
  const invoice = await prisma.invoices.findUniqueOrThrow({ where: { id: req.params.id }, include: { quotation: { include: { requirement: true } } } });
  if (!req.file) return res.status(400).json({ message: 'Receipt file is required' });
  const fileUrl = `/uploads/${req.file.filename}`;
  const receipt = await prisma.receipts.upsert({
    where: { invoiceId: invoice.id },
    update: { fileUrl, referenceNumber: body.referenceNumber, status: 'Uploaded' },
    create: { invoiceId: invoice.id, fileUrl, referenceNumber: body.referenceNumber, status: 'Uploaded' }
  });
  await prisma.invoices.update({ where: { id: invoice.id }, data: { status: 'Receipt Uploaded', transactionRef: body.referenceNumber } });
  const requirement = invoice.quotation.requirement;
  if (canTransition(requirement.workflow as any, 'receipt_uploaded')) {
    await prisma.requirements.update({ where: { id: requirement.id }, data: { workflow: 'receipt_uploaded' } });
  }
  return res.json(receipt);
});

router.put('/:id/verify', authGuard(['FINANCE', 'ADMIN']), async (req, res) => {
  const body = z.object({ verified: z.boolean(), note: z.string().optional(), clientId: z.string() }).parse(req.body);
  const invoice = await prisma.invoices.findUniqueOrThrow({ where: { id: req.params.id }, include: { quotation: { include: { requirement: true } } } });
  const updated = await prisma.invoices.update({ where: { id: invoice.id }, data: { status: body.verified ? 'Verified' : 'Rejected', financeNote: body.note } });
  if (body.verified) {
    const requirement = invoice.quotation.requirement;
    if (canTransition(requirement.workflow as any, 'payment_verified')) {
      await prisma.requirements.update({ where: { id: requirement.id }, data: { workflow: 'payment_verified' } });
    }
    const project = await prisma.projects.create({ data: { name: `Project ${invoice.invoiceNumber}`, invoiceId: invoice.id, clientId: body.clientId, status: 'In Progress', progress: 10 } });
    await prisma.milestones.createMany({
      data: [
        { projectId: project.id, title: 'Discovery', dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000), status: 'In Progress' },
        { projectId: project.id, title: 'Build', dueDate: new Date(Date.now() + 21 * 24 * 3600 * 1000), status: 'Not Started' },
        { projectId: project.id, title: 'UAT', dueDate: new Date(Date.now() + 35 * 24 * 3600 * 1000), status: 'Not Started' }
      ]
    });
    await prisma.requirements.update({ where: { id: requirement.id }, data: { workflow: 'milestones_created' } });

    await prisma.notifications.create({ data: { userId: body.clientId, title: 'Payment Verified', body: `Invoice ${invoice.invoiceNumber} has been verified`, status: 'new' } });
  }
  return res.json(updated);
});

router.get('/:id/pdf', authGuard(), async (req, res) => {
  const invoice = await prisma.invoices.findUniqueOrThrow({ where: { id: req.params.id } });
  const pdf = await buildPdf(`Invoice ${invoice.invoiceNumber}`, [
    `Amount: ${invoice.amount}`,
    `Status: ${invoice.status}`,
    `Transaction Ref: ${invoice.transactionRef || 'N/A'}`,
    `Created At: ${invoice.createdAt.toISOString()}`
  ]);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
  return res.send(pdf);
});

export default router;
