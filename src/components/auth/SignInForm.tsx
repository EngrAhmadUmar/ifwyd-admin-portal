"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Logo } from "@/components/icons/Logo";

export function SignInForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    const err = await login(email, password);
    setIsLoading(false);
    if (err) {
      setError(err);
    } else {
      router.push("/");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div>
        <Logo className="mx-auto h-[88px] w-auto" priority />
        <h1 className="mt-4 text-center text-[22px] font-bold text-neutral-900">Welcome back</h1>
        <p className="mx-auto mt-1 max-w-[280px] text-center text-[13px] leading-relaxed text-neutral-500">
          Sign in to publish projects and news to the IFWYD website.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-neutral-900">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your User name"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={isLoading}
            className="h-12 w-full rounded-lg bg-neutral-100 px-4 text-[13px] font-normal text-neutral-900 outline-none placeholder:text-[13px] placeholder:text-neutral-400 focus:ring-2 focus:ring-ifwyd-brand/20 disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-neutral-900">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={isLoading}
            className="h-12 w-full rounded-lg bg-neutral-100 px-4 text-[13px] font-normal text-neutral-900 outline-none placeholder:text-[13px] placeholder:text-neutral-400 focus:ring-2 focus:ring-ifwyd-brand/20 disabled:opacity-60"
          />
          <button
            type="button"
            className="mt-1.5 text-[13px] font-medium text-ifwyd-brand transition-colors hover:text-ifwyd-brand-dark"
          >
            Forgot Password?
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-2.5 text-[12px] font-medium leading-snug text-red-600 break-words">
            {error}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex h-12 w-full items-center justify-center rounded-full bg-ifwyd-brand text-[15px] font-semibold text-white transition-colors hover:bg-ifwyd-brand-dark disabled:opacity-60"
      >
        {isLoading ? "Signing in…" : "Login"}
      </button>
    </form>
  );
}
