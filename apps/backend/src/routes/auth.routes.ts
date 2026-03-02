import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env';
import { prisma } from '../services/prisma';

const router = Router();

router.post('/register', async (req, res) => {
  const body = z
    .object({ email: z.string().email(), password: z.string().min(8), name: z.string().min(2), role: z.enum(['CLIENT', 'PM', 'DEVELOPER', 'FINANCE', 'ADMIN']).default('CLIENT') })
    .parse(req.body);
  const password = await bcrypt.hash(body.password, 10);
  const user = await prisma.users.create({ data: { ...body, password } });
  return res.json({ id: user.id, email: user.email, role: user.role });
});

router.post('/login', async (req, res) => {
  const body = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body);
  const user = await prisma.users.findUnique({ where: { email: body.email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(body.password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, { expiresIn: '1d' });
  return res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

export default router;
