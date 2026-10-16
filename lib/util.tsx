import { createClient } from "@/lib/supabase/client";
import { Element, Monster } from "@/types";

export async function apiClient({
  body,
  endpoint,
  method,
  headers,
}: {
  body?: any;
  endpoint: string;
  method: "GET" | "POST" | "UPDATE" | "PATCH" | "DELETE";
  headers?: HeadersInit;
}) {
  console.log("body in apiClient: ", body);
  const isFormData = body instanceof FormData;
  const response = await fetch(`/api${endpoint}`, {
    method,
    headers: isFormData
      ? headers // never add Content-Type for FormData
      : { "Content-Type": "application/json", ...headers },
    ...(body !== undefined && method != "GET"
      ? { body: isFormData ? body : JSON.stringify(body) }
      : {}),
  });

  console.log("response in apiClient: ", response);

  return response;
}

export function loadElementImagePath(element: Element) {
  const realElement = element.replace("blight", "");
  const path = `/images/${realElement}.png`;
  return path;
}

export async function getValidImage({
  id,
  imgKey,
  currentUrl,
}: {
  id: string;
  imgKey: string;
  currentUrl: string;
}): Promise<string> {
  if (!imgKey) return "";
  console.log("imgKey in getValidImage: ", imgKey);
  const refreshResponse = await apiClient({
    endpoint: `images/sign`,
    method: "POST",
    body: {
      imgKey: imgKey,
    },
  });

  console.log("refreshResponse: ", refreshResponse);

  if (!refreshResponse.ok) {
    throw new Error("Failed to refresh signed URL");
  }

  const data = await refreshResponse.json();
  return data.signedUrl;
}
