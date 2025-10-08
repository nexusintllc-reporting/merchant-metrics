import { json } from "@remix-run/node";

export async function loader() {
  return json({ message: "Test route works!", timestamp: new Date().toISOString() });
}