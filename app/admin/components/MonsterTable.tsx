"use client";

import { Monster } from "@/types";
import { SquarePen, Trash } from "lucide-react";
import React, { useState } from "react";
import { MonsterFormDialog } from "./MonsterFormDialog";
import { deleteMonster } from "@/app/services/monsterServices";
import { useRouter } from "next/navigation";

const MonsterTable = ({
  tableHeaders,
  monsters,
}: {
  tableHeaders: string[];
  monsters: Monster[];
}) => {
  const router = useRouter();
  const [editingMonster, setEditingMonster] = useState<Monster | null>(null);
  const [open, setOpen] = useState(false);
  const handleDelete = async (id: string) => {
    await deleteMonster(id);
    router.refresh();
  };
  return (
    <div className="mx-auto w-full max-w-6xl overflow-x-auto rounded-lg border border-black bg-panel-background">
      <table className="w-full min-w-[600px] border-collapse text-left">
        <thead>
          <tr className="bg-panel-background2">
            {tableHeaders.map((header) => (
              <th
                key={header}
                scope="col"
                className="border-b border-r border-black px-4 py-3 font-semibold last:border-r-0"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {monsters.map((monster) => (
            <tr
              key={monster.id}
              className="border-b border-black last:border-b-0 hover:bg-blue-100"
            >
              <td className="border-r border-black px-4 py-3 last:border-r-0">
                {monster.name}
              </td>

              <td className="border-r border-black px-4 py-3 last:border-r-0">
                {monster.threatLevel ?? "—"}
              </td>

              <td className="px-4 py-3 last:border-r-0 border-r border-black">
                {Object.entries(monster.elementalWeakness ?? {}).map(
                  ([element, bodyParts]) => (
                    <div
                      key={element}
                      className="rounded border border-black p-2"
                    >
                      <h3 className="font-bold capitalize">{element}</h3>

                      {Object.entries(bodyParts ?? {}).map(
                        ([bodyPart, value]) => (
                          <div key={bodyPart} className="text-sm">
                            {bodyPart}: {value}
                          </div>
                        ),
                      )}
                    </div>
                  ),
                )}
              </td>

              <td className="border-r border-black px-4 py-3 last:border-r-0">
                {monster?.abnormalStatus?.map((status, index) => (
                  <h3 key={index} className="font-bold capitalize">
                    {status}
                  </h3>
                ))}
              </td>

              <td className="border-r border-black px-4 py-3 last:border-r-0">
                <SquarePen
                  className="cursor-pointer"
                  onClick={() => setEditingMonster(monster)}
                />

                {editingMonster && (
                  <MonsterFormDialog
                    key={editingMonster.id}
                    mode="edit"
                    monster={editingMonster}
                    open
                    onOpenChange={(next) => {
                      if (!next) setEditingMonster(null);
                    }}
                  />
                )}
              </td>
              <td className="border-r border-black px-4 py-3 last:border-r-0">
                <Trash onClick={() => handleDelete(monster?.id)} />
              </td>
            </tr>
          ))}

          {monsters.length === 0 && (
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                No monsters found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MonsterTable;
