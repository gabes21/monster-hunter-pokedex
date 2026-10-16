import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export default async function AdminGuard({
  children,
  needAuth = false,
}: {
  children: React.ReactNode;
  needAuth?: boolean;
}) {
  await connection();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (needAuth && !user) {
    redirect("/admin");
  } else if (!needAuth && user) {
    redirect("/admin/monster");
  }

  return <>{children}</>;
}
