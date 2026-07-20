const STATUS_STYLES = {
  unsubmitted: "bg-gray-100 text-gray-600",
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  dispatched: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS = {
  unsubmitted: "Not Submitted",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default function StatusBadge({ status, label }) {
  const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${style}`}
    >
      {label || STATUS_LABELS[status] || status}
    </span>
  );
}
