import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Mail, MailCheck } from "lucide-react";

import TextInput from "../../components/ui/forms/TextInput";
import Button from "../../components/ui/buttons/Button";
import { forgotPasswordSchema } from "../../utils/schemas/authSchemas";
import { authService } from "../../services/authService";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await authService.requestPasswordReset(data.email);
      setSent(true);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-sm bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-md p-8 text-center">
        {sent ? (
          <>
            <MailCheck className="h-10 w-10 text-[var(--color-success)] mx-auto" />
            <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold mt-4">
              Check your email
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              If an account exists with that email, we've sent a link to reset
              your password.
            </p>
            <Link
              to="/login"
              className="text-sm text-[var(--color-primary)] font-medium mt-6 inline-block"
            >
              Back to login
            </Link>
          </>
        ) : (
          <>
            <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold">
              Reset your password
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              Enter your email and we'll send you a reset link.
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 flex flex-col gap-4 text-left"
            >
              <TextInput
                label="Email"
                icon={Mail}
                type="email"
                required
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />
              {serverError && (
                <p className="text-sm text-[var(--color-danger)]">
                  {serverError}
                </p>
              )}
              <Button type="submit" isLoading={isLoading} className="w-full">
                Send reset link
              </Button>
            </form>
            <Link
              to="/login"
              className="text-sm text-[var(--color-text-secondary)] mt-5 inline-block"
            >
              Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
