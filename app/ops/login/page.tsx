import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSession, verifySession } from "@/lib/auth";

async function loginAction(formData: FormData) {
  "use server";
  const password = formData.get("password") as string;
  if (password === process.env.OPS_PASSWORD) {
    const token = await createSession();
    const cookieStore = await cookies();
    cookieStore.set("ops-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    redirect("/ops");
  }
  redirect("/ops/login?error=1");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // Already authenticated? Redirect straight to /ops
  const cookieStore = await cookies();
  const token = cookieStore.get("ops-session")?.value;
  if (token) {
    const valid = await verifySession(token);
    if (valid) redirect("/ops");
  }

  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-sm space-y-6 p-8 rounded-2xl border border-slate-800 bg-slate-900/50">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Ops Access</h1>
          <p className="text-slate-400 text-sm">Enter your ops password to continue</p>
        </div>

        {hasError && (
          <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
            Incorrect password. Try again.
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            autoFocus
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg py-3 font-semibold hover:opacity-90 transition-opacity"
          >
            Access Ops Dashboard
          </button>
        </form>

        <a
          href="/dashboard"
          className="block text-center text-slate-500 text-sm hover:text-slate-300 transition-colors"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
