import { useEffect, useState } from "react";
import { FileText, Check, X as XIcon } from "lucide-react";

import StatusBadge from "../../components/ui/badges/StatusBadge";
import Button from "../../components/ui/buttons/Button";
import Modal from "../../components/ui/modals/Modal";
import { sellerService } from "../../services/sellerService";

const FILTERS = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "All", value: "" },
];

export default function AdminSellerVerificationPage() {
  const [profiles, setProfiles] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [remarks, setRemarks] = useState("");

  const load = async (statusFilter) => {
    setLoading(true);
    try {
      const data = await sellerService.listVerifications(statusFilter);
      setProfiles(data.results || data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(filter);
  }, [filter]);

  const handleApprove = async (id) => {
    setActioningId(id);
    try {
      await sellerService.approveVerification(id);
      await load(filter);
    } finally {
      setActioningId(null);
    }
  };

  const openReject = (profile) => {
    setRejectTarget(profile);
    setRemarks("");
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    setActioningId(rejectTarget.id);
    try {
      await sellerService.rejectVerification(rejectTarget.id, remarks);
      setRejectTarget(null);
      await load(filter);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold mb-1">
          Seller Verification Management
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          Review submitted documents and approve or reject seller accounts.
        </p>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filter === f.value
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-sm text-[var(--color-text-secondary)]">
              Loading...
            </div>
          ) : profiles.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--color-text-secondary)]">
              No sellers found for this filter.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-[var(--color-text-secondary)]">
                <tr>
                  <th className="px-5 py-3 font-medium">Seller</th>
                  <th className="px-5 py-3 font-medium">Documents</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-[var(--color-border)] hover:bg-gray-50"
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-[var(--color-text-primary)]">
                        {p.username}
                      </div>
                      <div className="text-[var(--color-text-secondary)] text-xs">
                        {p.email}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-3">
                        {p.identity_document && (
                          <a
                            href={p.identity_document}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[var(--color-primary)] hover:underline"
                          >
                            <FileText className="h-4 w-4" /> ID
                          </a>
                        )}
                        {p.shop_document && (
                          <a
                            href={p.shop_document}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[var(--color-primary)] hover:underline"
                          >
                            <FileText className="h-4 w-4" /> Shop
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={p.verification_status} />
                    </td>
                    <td className="px-5 py-3">
                      {p.verification_status === "pending" ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="success"
                            isLoading={actioningId === p.id}
                            onClick={() => handleApprove(p.id)}
                            className="!px-3 !py-1.5"
                          >
                            <Check className="h-4 w-4" /> Approve
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => openReject(p)}
                            className="!px-3 !py-1.5"
                          >
                            <XIcon className="h-4 w-4" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <div className="text-right text-xs text-[var(--color-text-secondary)]">
                          {p.reviewed_at
                            ? new Date(p.reviewed_at).toLocaleDateString()
                            : "-"}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title="Reject Seller Verification"
      >
        <p className="text-sm text-[var(--color-text-secondary)] mb-3">
          Add a remark explaining why {rejectTarget?.username}'s verification is
          being rejected. They'll see this and can resubmit.
        </p>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={4}
          placeholder="e.g. Identity document is blurry, please reupload a clearer photo."
          className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] p-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 resize-none"
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={() => setRejectTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            isLoading={actioningId === rejectTarget?.id}
            onClick={confirmReject}
          >
            Confirm Reject
          </Button>
        </div>
      </Modal>
    </div>
  );
}
