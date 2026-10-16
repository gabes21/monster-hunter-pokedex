import { apiClient } from "@/lib/util";
import { Monster, MonsterInput } from "@/types";

export async function getAllMonster() {
  const rawData = await apiClient({
    endpoint: "/monster",
    method: "GET",
  });

  return rawData.json();
}

export async function createMonster(body: MonsterInput, image: File) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(body));
  formData.append("image", image);
  const res = await apiClient({
    endpoint: "/monster",
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(`Failed to create monster: ${res.status}`);
  return res.json();
}

export async function deleteMonster(id: string) {
  const res = await apiClient({
    endpoint: `/monster/${id}`,
    method: "DELETE",
  });

  if (!res.ok) throw new Error(`Failed to create monster: ${res.status}`);
  return res;
}

export async function updateMonster(
  id: string,
  body: MonsterInput,
  image: File | null,
) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(body));
  if (image) formData.append("image", image);

  const res = await apiClient({
    endpoint: `/monster/${id}`,
    method: "PATCH",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to update monster");
  return res.json();
}
