const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function TransactionStatusBadge({ status }) {
  return (
    <span
      className={`inline-block text-xs px-2 py-1 rounded-full capitalize ${
        statusStyles[status]
      }`}
    >
      {status}
    </span>
  );
}
