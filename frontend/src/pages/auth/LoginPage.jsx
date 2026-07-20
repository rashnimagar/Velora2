import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import TextInput from "../../components/ui/forms/TextInput";
import PasswordInput from "../../components/ui/forms/PasswordInput";
import Button from "../../components/ui/buttons/Button";
import { loginSchema } from "../../utils/schemas/authSchemas";
import { loginUser, clearAuthError } from "../../features/auth/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    dispatch(clearAuthError());
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.role;
      navigate(
        role === "seller"
          ? "/seller/dashboard"
          : role === "admin"
            ? "/admin/dashboard"
            : "/",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-sm bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-md p-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-center">
          Welcome back
        </h1>
        <p className="text-sm text-center text-[var(--color-text-secondary)] mt-1">
          Log in to your VELORA account
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
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
          <div>
            <PasswordInput
              label="Password"
              required
              placeholder="Your password"
              error={errors.password?.message}
              {...register("password")}
            />
            <div className="flex justify-end mt-1.5">
              <Link
                to="/forgot-password"
                className="text-xs text-[var(--color-primary)] font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {error && (
            <p className="text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/10 rounded-[var(--radius-input)] px-3 py-2">
              {typeof error === "string"
                ? error
                : Object.values(error).flat().join(" ")}
            </p>
          )}

          <Button
            type="submit"
            isLoading={status === "loading"}
            className="w-full mt-1"
          >
            Log in
          </Button>
        </form>

        <p className="text-sm text-center text-[var(--color-text-secondary)] mt-5">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[var(--color-primary)] font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
