import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, User, Store, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import TextInput from "../../components/ui/forms/TextInput";
import PasswordInput from "../../components/ui/forms/PasswordInput";
import Button from "../../components/ui/buttons/Button";
import { registerSchema } from "../../utils/schemas/authSchemas";
import { registerUser, clearAuthError } from "../../features/auth/authSlice";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "buyer" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    dispatch(clearAuthError());
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      navigate(result.payload.role === "seller" ? "/seller/verification" : "/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 py-10">
      <div className="w-full max-w-md bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-md p-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-center">
          Create your account
        </h1>
        <p className="text-sm text-center text-[var(--color-text-secondary)] mt-1">
          Join VELORA as a buyer or seller
        </p>

        {/* Role selection */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            type="button"
            onClick={() => setValue("role", "buyer")}
            className={`flex flex-col items-center gap-2 rounded-[var(--radius-card)] border p-4 transition ${
              selectedRole === "buyer"
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                : "border-[var(--color-border)]"
            }`}
          >
            <ShoppingBag className="h-5 w-5 text-[var(--color-primary)]" />
            <span className="text-sm font-medium">Buyer</span>
          </button>
          <button
            type="button"
            onClick={() => setValue("role", "seller")}
            className={`flex flex-col items-center gap-2 rounded-[var(--radius-card)] border p-4 transition ${
              selectedRole === "seller"
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                : "border-[var(--color-border)]"
            }`}
          >
            <Store className="h-5 w-5 text-[var(--color-primary)]" />
            <span className="text-sm font-medium">Seller</span>
          </button>
        </div>
        {errors.role && (
          <p className="text-xs text-[var(--color-danger)] mt-1">
            {errors.role.message}
          </p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          <TextInput
            label="Username"
            icon={User}
            required
            placeholder="e.g. rashni_dev"
            error={errors.username?.message}
            {...register("username")}
          />
          <p className="text-xs text-[var(--color-text-secondary)] -mt-2">
            Letters, numbers, and @/./+/-/_ only — no spaces.
          </p>
          <TextInput
            label="Email"
            icon={Mail}
            type="email"
            required
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <TextInput
            label="Phone"
            icon={Phone}
            required
            placeholder="98XXXXXXXX"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <PasswordInput
            label="Password"
            required
            placeholder="At least 8 characters"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordInput
            label="Confirm password"
            required
            placeholder="Re-enter your password"
            error={errors.confirm_password?.message}
            {...register("confirm_password")}
          />

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
            Create account
          </Button>
        </form>

        <p className="text-sm text-center text-[var(--color-text-secondary)] mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--color-primary)] font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
