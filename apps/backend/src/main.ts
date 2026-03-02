import express from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import requirementRoutes from './routes/requirements.routes';
import quotationRoutes from './routes/quotations.routes';
import invoiceRoutes from './routes/invoices.routes';
import projectRoutes from './routes/projects.routes';
import taskRoutes from './routes/tasks.routes';
import notificationRoutes from './routes/notifications.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middleware/error';

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRoutes);
app.use('/requirements', requirementRoutes);
app.use('/quotations', quotationRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
app.use('/notifications', notificationRoutes);
app.use('/admin', adminRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on ${env.port}`);
});
