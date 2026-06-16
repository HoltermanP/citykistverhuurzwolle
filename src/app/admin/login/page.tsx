import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: r } = await searchParams;
  const redirect = typeof r === "string" ? r : "/admin";
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <LoginForm redirect={redirect} />
    </div>
  );
}
