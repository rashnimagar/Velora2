import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import PasswordInput from "../../components/ui/forms/PasswordInput";
import Button from "../../components/ui/buttons/Button";
import { resetPasswordSchema } from "../../utils/schemas/authSchemas";
import { authService } from "../../services/authService";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await authService.confirmPasswordReset({ uid, token, ...data });
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "This reset link is invalid or has expired.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!uid || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 text-center">
        <div className="w-full max-w-sm bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-md p-8">
          <p className="text-sm text-[var(--color-danger)]">
            This reset link is missing required information.
          </p>
          <Link
            to="/forgot-password"
            className="text-sm text-[var(--color-primary)] font-medium mt-4 inline-block"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-sm bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-md p-8 text-center">
        {done ? (
          <>
            <CheckCircle2 className="h-10 w-10 text-[var(--color-success)] mx-auto" />
            <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold mt-4">
              Password reset
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              Redirecting you to login...
            </p>
          </>
        ) : (
          <>
            <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold">
              Choose a new password
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 flex flex-col gap-4 text-left"
            >
              <PasswordInput
                label="New password"
                required
                placeholder="At least 8 characters"
                error={errors.new_password?.message}
                {...register("new_password")}
              />
              <PasswordInput
                label="Confirm new password"
                required
                placeholder="Re-enter your new password"
                error={errors.confirm_password?.message}
                {...register("confirm_password")}
              />
              {serverError && (
                <p className="text-sm text-[var(--color-danger)]">
                  {serverError}
                </p>
              )}
              <Button type="submit" isLoading={isLoading} className="w-full">
                Reset password
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
