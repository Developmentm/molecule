"use client";

export default function DeleteButton({
  action,
  confirmText = "Are you sure you want to delete this?",
  label = "Delete",
}: {
  action: (formData: FormData) => void | Promise<void>;
  confirmText?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-sm font-medium text-red-700 hover:underline">
        {label}
      </button>
    </form>
  );
}
