"use client";

import { markInvoicePaid, markInvoiceSent } from "../actions";

export default function InvoiceActions({
  invoiceId,
  status,
  clientEmail,
  invoiceNumber,
}: {
  invoiceId: string;
  status: string;
  clientEmail: string | null;
  invoiceNumber: string;
}) {
  const mailHref = clientEmail
    ? `mailto:${clientEmail}?subject=${encodeURIComponent(`Invoice ${invoiceNumber}`)}&body=${encodeURIComponent(
        `Dear Client,\n\nPlease find attached invoice ${invoiceNumber}. You can view the details by printing/saving this page as PDF.\n\nRegards,\nLexTrack`
      )}`
    : undefined;

  return (
    <div className="no-print flex flex-wrap gap-3">
      {status === "DRAFT" && (
        <form
          action={async () => {
            await markInvoiceSent(invoiceId);
          }}
        >
          <button type="submit" className="btn-primary">Mark as Sent</button>
        </form>
      )}
      {status !== "PAID" && (
        <form
          action={async () => {
            await markInvoicePaid(invoiceId);
          }}
        >
          <button type="submit" className="btn-secondary">Mark as Paid</button>
        </form>
      )}
      {mailHref && (
        <a href={mailHref} className="btn-secondary">Email to Client</a>
      )}
      <button type="button" onClick={() => window.print()} className="btn-secondary">
        Print / Save PDF
      </button>
    </div>
  );
}
