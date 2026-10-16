import { getAllMonster } from "@/app/services/monsterServices";
import FullScreenErrorDisplay from "@/components/FullScreenErrorDisplay";
import LoadingComponent from "@/components/LoadingComponent";
import { createClient } from "@/lib/supabase/server";
import { Monster } from "@/types";
import { SquarePen, Trash } from "lucide-react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import MonsterTable from "../components/MonsterTable";
import { MonsterFormDialog } from "../components/MonsterFormDialog";

export default async function MonsterContent() {
  await connection();
  const supabase = await createClient();

  const { data: monstersList, error } = await supabase
    .from("monsters")
    .select("*")
    .is("deletedAt", null)
    .order("id");

  const monsters: Monster[] = monstersList || [];

  if (error) {
    return (
      <FullScreenErrorDisplay text="Failed to load monsters."></FullScreenErrorDisplay>
    );
  }
  console.log("monster Data: ", monsters);

  const tableHeaders = [
    "Name",
    "Threat Level",
    "Elemental Weakness",
    "Abnormal Status",
    "Edit",
    "Delete",
  ];

  return (
    <div className="w-full min-h-screen p-4 md:p-8">
      <div className="w-[90%] flex justify-end items-center py-4 px-2">
        <MonsterFormDialog mode="add"></MonsterFormDialog>
      </div>
      <MonsterTable
        tableHeaders={tableHeaders}
        monsters={monsters}
      ></MonsterTable>
    </div>
  );
}
