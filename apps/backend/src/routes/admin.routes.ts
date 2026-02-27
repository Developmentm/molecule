import { Router } from 'express';
import { authGuard } from '../middleware/auth';
import { prisma } from '../services/prisma';

const router = Router();

router.get('/analytics', authGuard(['ADMIN']), async (_req, res) => {
  const [users, projects, revenue, invoices] = await Promise.all([
    prisma.users.count(),
    prisma.projects.count(),
    prisma.invoices.aggregate({ _sum: { amount: true }, where: { status: 'Verified' } }),
    prisma.invoices.count()
  ]);
  return res.json({ users, projects, invoices, revenue: revenue._sum.amount || 0 });
});

router.get('/users', authGuard(['ADMIN']), async (_req, res) => {
  return res.json(await prisma.users.findMany({ orderBy: { createdAt: 'desc' } }));
});

export default router;
