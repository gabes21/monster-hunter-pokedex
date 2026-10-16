import { Suspense } from "react";
import MonsterContent from "./MonsterContent";
import LoadingComponent from "@/components/LoadingComponent";
import AdminGuard from "../components/AdminGuard";

export default function MonsterPage() {
  return (
    <Suspense
      fallback={
        <LoadingComponent text="Loading admin page..."></LoadingComponent>
      }
    >
      <MonsterContent />
    </Suspense>
  );
}
