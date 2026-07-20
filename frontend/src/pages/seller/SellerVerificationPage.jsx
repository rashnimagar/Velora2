import { useEffect, useState } from "react";
import { Clock, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import FileUpload from "../../components/ui/forms/FileUpload";
import Button from "../../components/ui/buttons/Button";
import StatusBadge from "../../components/ui/badges/StatusBadge";
import { sellerService } from "../../services/sellerService";

export default function SellerVerificationPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [identityDoc, setIdentityDoc] = useState(null);
  const [shopDoc, setShopDoc] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const data = await sellerService.getMyVerification();
      setProfile(data);
    } catch {
      setSubmitError(
        "Couldn't load your verification status. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!identityDoc) errs.identity = "Identity document is required.";
    if (!shopDoc) errs.shop = "Shop verification document is required.";
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append("identity_document", identityDoc);
      formData.append("shop_document", shopDoc);
      const data = await sellerService.submitVerification(formData);
      setProfile(data.profile);
      setIdentityDoc(null);
      setShopDoc(null);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          "Something went wrong submitting your documents.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[var(--color-text-secondary)] text-sm">Loading...</p>
      </div>
    );
  }

  const status = profile?.verification_status;

  return (
    <div className="px-4 py-12 flex items-start justify-center">
      <div className="w-full max-w-lg bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-md p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
            Seller Verification
          </h1>
          {status && <StatusBadge status={status} />}
        </div>

        {/* Screen 22 - Pending */}
        {status === "pending" && (
          <div className="text-center py-6">
            <Clock className="h-12 w-12 text-[var(--color-warning)] mx-auto" />
            <p className="mt-4 text-[var(--color-text-primary)] font-medium">
              Your verification request is pending.
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Please wait for administrator approval. This usually takes 1-2
              business days.
            </p>
          </div>
        )}

        {/* Screen 21 - Approved */}
        {status === "approved" && (
          <div className="text-center py-6">
            <CheckCircle2 className="h-12 w-12 text-[var(--color-success)] mx-auto" />
            <p className="mt-4 text-[var(--color-text-primary)] font-medium">
              Your verification has been approved.
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              You may now list products on VELORA.
            </p>
            <Button
              className="mt-6"
              onClick={() => navigate("/seller/dashboard")}
            >
              <ShieldCheck className="h-4 w-4" />
              Start Selling
            </Button>
          </div>
        )}

        {/* Screen 23 - Rejected (shows reason + resubmit form) */}
        {status === "rejected" && profile?.admin_remarks && (
          <div className="flex items-start gap-3 rounded-[var(--radius-input)] bg-[var(--color-danger)]/10 p-4 mb-6">
            <XCircle className="h-5 w-5 text-[var(--color-danger)] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[var(--color-danger)]">
                Your verification was rejected
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                {profile.admin_remarks}
              </p>
            </div>
          </div>
        )}

        {/* Screen 20 - Upload form (shown when unsubmitted or rejected) */}
        {(status === "unsubmitted" || status === "rejected") && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <p className="text-sm text-[var(--color-text-secondary)]">
              {status === "rejected"
                ? "Please review the reason above and resubmit your documents."
                : "Upload your identity and shop documents to start selling on VELORA."}
            </p>
            <FileUpload
              label="Identity Document"
              required
              accept="image/*,.pdf"
              error={formErrors.identity}
              onChange={setIdentityDoc}
            />
            <FileUpload
              label="Shop Verification Document"
              required
              accept="image/*,.pdf"
              error={formErrors.shop}
              onChange={setShopDoc}
            />
            {submitError && (
              <p className="text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/10 rounded-[var(--radius-input)] px-3 py-2">
                {submitError}
              </p>
            )}
            <Button type="submit" isLoading={submitting} className="w-full">
              {status === "rejected"
                ? "Resubmit for Review"
                : "Submit for Verification"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
