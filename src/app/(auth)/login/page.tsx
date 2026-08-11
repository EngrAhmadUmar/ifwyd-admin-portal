import { SignInForm } from "@/components/auth/SignInForm";
import { APP_FULL_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | IFWYD Admin",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div
        className="hidden flex-1 flex-col justify-end px-12 py-16 lg:flex"
        style={{ background: "linear-gradient(180deg, #D6398F 0%, #9C2E76 45%, #4C1140 100%)" }}
      >
        <h2 className="max-w-md text-[34px] font-bold leading-[1.2] text-white">
          Every story you publish moves the mission forward.
        </h2>
        <p className="mt-4 text-[13px] text-white/80">{APP_FULL_NAME} · Authorised team members only</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-[360px]">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
