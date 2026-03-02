import { Router } from 'express';
import { z } from 'zod';
import { authGuard } from '../middleware/auth';
import { canTransition } from '../types/workflow';
import { prisma } from '../services/prisma';
import { buildPdf } from '../services/pdf';
import { sendMockEmail } from '../services/email';

const router = Router();

router.post('/', authGuard(['PM', 'ADMIN']), async (req, res) => {
  const body = z.object({ requirementId: z.string(), lineItems: z.array(z.object({ name: z.string(), amount: z.number().positive() })) }).parse(req.body);
  const requirement = await prisma.requirements.findUniqueOrThrow({ where: { id: body.requirementId }, include: { company: { include: { users: true } } } });
  if (!canTransition(requirement.workflow as any, 'quotation_sent')) {
    return res.status(400).json({ message: `Invalid workflow transition from ${requirement.workflow} to quotation_sent` });
  }
  const total = body.lineItems.reduce((sum, item) => sum + item.amount, 0);
  const quotation = await prisma.quotations.create({ data: { requirementId: body.requirementId, lineItems: body.lineItems as any, total, status: 'Sent' } });
  await prisma.requirements.update({ where: { id: body.requirementId }, data: { workflow: 'quotation_sent', status: 'quoted' } });

  const client = requirement.company.users.find((u) => u.role === 'CLIENT');
  if (client) {
    await prisma.notifications.create({ data: { userId: client.id, title: 'Quotation Sent', body: `Quotation ${quotation.id} sent for ${requirement.title}`, status: 'new' } });
    await sendMockEmail(client.email, 'Quotation Sent', `Quotation ${quotation.id} total ${quotation.total}`);
  }

  return res.json(quotation);
});

router.put('/:id/status', authGuard(['PM', 'ADMIN', 'CLIENT']), async (req, res) => {
  const body = z.object({ status: z.enum(['Draft', 'Sent', 'Accepted', 'Rejected']) }).parse(req.body);
  const quotation = await prisma.quotations.update({ where: { id: req.params.id }, data: { status: body.status } });
  if (body.status === 'Accepted') {
    const requirement = await prisma.requirements.findUnique({ where: { id: quotation.requirementId } });
    if (requirement && canTransition(requirement.workflow as any, 'quotation_accepted')) {
      await prisma.requirements.update({ where: { id: requirement.id }, data: { workflow: 'quotation_accepted' } });
    }
  }
  return res.json(quotation);
});

router.get('/:id/pdf', authGuard(), async (req, res) => {
  const quotation = await prisma.quotations.findUniqueOrThrow({ where: { id: req.params.id }, include: { requirement: true } });
  const pdf = await buildPdf(`Quotation ${quotation.id}`, [
    `Requirement: ${quotation.requirement.title}`,
    `Total: ${quotation.total}`,
    `Status: ${quotation.status}`,
    `Created At: ${quotation.createdAt.toISOString()}`
  ]);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="quotation-${quotation.id}.pdf"`);
  return res.send(pdf);
});

export default router;
