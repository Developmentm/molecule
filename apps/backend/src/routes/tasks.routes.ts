import { Router } from 'express';
import { z } from 'zod';
import { authGuard } from '../middleware/auth';
import { prisma } from '../services/prisma';

const router = Router();

router.put('/:id/status', authGuard(['DEVELOPER', 'PM', 'ADMIN']), async (req, res) => {
  const body = z.object({ status: z.enum(['Not Started', 'In Progress', 'Under Review', 'Approved', 'Rework']), timeLogHours: z.number().min(0).default(0) }).parse(req.body);
  const task = await prisma.tasks.update({ where: { id: req.params.id }, data: { status: body.status, timeLogHours: body.timeLogHours } });
  return res.json(task);
});

export default router;
