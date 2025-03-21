const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export async function GET(path: string) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url);

  return res;
}

export async function POST(path: string, data: any) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res;
}
