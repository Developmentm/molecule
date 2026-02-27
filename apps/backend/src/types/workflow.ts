export type WorkflowState =
  | 'lead'
  | 'requirement_received'
  | 'scoping'
  | 'quotation_sent'
  | 'quotation_accepted'
  | 'invoice_sent'
  | 'payment_pending'
  | 'receipt_uploaded'
  | 'payment_verified'
  | 'milestones_created'
  | 'in_progress'
  | 'review'
  | 'completed';

export const WORKFLOW_TRANSITIONS: Record<WorkflowState, WorkflowState[]> = {
  lead: ['requirement_received'],
  requirement_received: ['scoping'],
  scoping: ['quotation_sent'],
  quotation_sent: ['quotation_accepted'],
  quotation_accepted: ['invoice_sent'],
  invoice_sent: ['payment_pending'],
  payment_pending: ['receipt_uploaded'],
  receipt_uploaded: ['payment_verified'],
  payment_verified: ['milestones_created'],
  milestones_created: ['in_progress'],
  in_progress: ['review'],
  review: ['completed'],
  completed: []
};

export const canTransition = (from: WorkflowState, to: WorkflowState): boolean =>
  WORKFLOW_TRANSITIONS[from]?.includes(to) ?? false;
