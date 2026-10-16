import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminLogin from "./AdminLogin";
import LoadingComponent from "@/components/LoadingComponent";
import { Suspense } from "react";
import AdminGuard from "./components/AdminGuard";

export default async function AdminPage() {
  return (
    <Suspense fallback={<LoadingComponent text="Loading admin page..." />}>
      <AdminLogin />
    </Suspense>
  );
}
