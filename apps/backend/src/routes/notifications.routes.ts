import { Router } from 'express';
import { z } from 'zod';
import { authGuard } from '../middleware/auth';
import { prisma } from '../services/prisma';

const router = Router();

router.get('/', authGuard(), async (req, res) => {
  const query = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(50).default(10)
  }).parse(req.query);
  const user = (req as any).user;

  const [items, total] = await Promise.all([
    prisma.notifications.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize
    }),
    prisma.notifications.count({ where: { userId: user.id } })
  ]);

  return res.json({
    items,
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.ceil(total / query.pageSize)
    }
  });
});

export default router;
