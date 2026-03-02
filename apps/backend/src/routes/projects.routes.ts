import { Router } from 'express';
import { z } from 'zod';
import { authGuard } from '../middleware/auth';
import { prisma } from '../services/prisma';

const router = Router();

router.get('/', authGuard(), async (req, res) => {
  const query = z.object({
    search: z.string().optional(),
    status: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(50).default(10)
  }).parse(req.query);

  const where = {
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' as const } },
            { status: { contains: query.search, mode: 'insensitive' as const } }
          ]
        }
      : {}),
    ...(query.status ? { status: query.status } : {})
  };

  const [items, total] = await Promise.all([
    prisma.projects.findMany({
      where,
      include: { milestones: { include: { tasks: true } }, client: true, invoice: true },
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize
    }),
    prisma.projects.count({ where })
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

router.post('/:id/milestones', authGuard(['PM', 'ADMIN']), async (req, res) => {
  const body = z.object({ title: z.string(), dueDate: z.string(), status: z.string().default('Not Started') }).parse(req.body);
  const milestone = await prisma.milestones.create({ data: { projectId: req.params.id, title: body.title, dueDate: new Date(body.dueDate), status: body.status } });
  return res.json(milestone);
});

export default router;
