import { Router } from 'express';
import multer from 'multer';
import OpenAI from 'openai';
import { z } from 'zod';
import { env } from '../config/env';
import { authGuard } from '../middleware/auth';
import { canTransition } from '../types/workflow';
import { prisma } from '../services/prisma';

const router = Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', authGuard(['CLIENT']), upload.single('file'), async (req, res) => {
  const body = z.object({ title: z.string(), description: z.string(), budgetRange: z.string(), deadline: z.string(), priority: z.string(), companyId: z.string() }).parse(req.body);
  const requirement = await prisma.requirements.create({
    data: { ...body, deadline: new Date(body.deadline), workflow: 'requirement_received', status: 'submitted' }
  });
  await prisma.activity_logs.create({ data: { actorId: (req as any).user.id, action: 'CREATE_REQUIREMENT', entityType: 'requirement', entityId: requirement.id, status: 'logged' } });
  return res.json(requirement);
});

router.get('/:id', authGuard(), async (req, res) => {
  const requirement = await prisma.requirements.findUnique({ where: { id: req.params.id }, include: { chats: true, quotation: true, files: true } });
  return res.json(requirement);
});

router.post('/:id/chat', authGuard(), async (req, res) => {
  const body = z.object({ message: z.string().min(2) }).parse(req.body);
  const reqItem = await prisma.requirements.findUniqueOrThrow({ where: { id: req.params.id } });
  await prisma.chats.create({ data: { requirementId: reqItem.id, role: 'user', message: body.message } });
  let reply = 'Mock AI: Thanks. Suggested milestones: Discovery, Implementation, UAT. Estimated budget distribution 20/60/20.';
  if (env.openAiApiKey) {
    const client = new OpenAI({ apiKey: env.openAiApiKey });
    const completion = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are a project scoping assistant.' }, { role: 'user', content: body.message }] });
    reply = completion.choices[0]?.message?.content || reply;
  }
  const ai = await prisma.chats.create({ data: { requirementId: reqItem.id, role: 'assistant', message: reply } });
  if (canTransition(reqItem.workflow as any, 'scoping')) {
    await prisma.requirements.update({ where: { id: reqItem.id }, data: { workflow: 'scoping' } });
  }
  return res.json(ai);
});

router.put('/:id/workflow', authGuard(['PM', 'ADMIN', 'FINANCE']), async (req, res) => {
  const body = z.object({ next: z.enum(['lead','requirement_received','scoping','quotation_sent','quotation_accepted','invoice_sent','payment_pending','receipt_uploaded','payment_verified','milestones_created','in_progress','review','completed']) }).parse(req.body);
  const requirement = await prisma.requirements.findUniqueOrThrow({ where: { id: req.params.id } });
  if (!canTransition(requirement.workflow as any, body.next as any)) {
    return res.status(400).json({ message: `Invalid transition from ${requirement.workflow} to ${body.next}` });
  }
  const updated = await prisma.requirements.update({ where: { id: requirement.id }, data: { workflow: body.next } });
  return res.json(updated);
});

export default router;
