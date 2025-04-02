import { useAuth } from "../hooks/auth";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export async function GET(path: string): Promise<Response> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: token ? { Authorization: token } : {},
  });

  return res;
}

export async function POST(path: string, data: any): Promise<Response> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res;
}
