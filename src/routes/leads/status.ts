import { createClient } from "@supabase/supabase-js";
import { Context } from "hono";

export async function leadStatus(c:Context) {
  try {
    const supabase = createClient(
      c.env.NEXT_PUBLIC_SUPABASE_URL,
      c.env.SUPABASE_SECRET,
    );

    const teacher = c.req.query("teacher");

    const { data, error } = await supabase
      .from("leads")
      .select("status")
      .eq("teacher", teacher);

    if (error) throw error;

    const counts = new Map<string, number>();

    data.forEach((lead) => {
      const status = lead.status?.trim() || "Unknown";

      counts.set(status, (counts.get(status) ?? 0) + 1);
    });

    const result = [...counts.entries()]
      .map(([status, leads]) => ({
        status,
        leads,
      }))
      .sort((a, b) => b.leads - a.leads);

    return c.json(result);
  } catch (err) {
    console.error(err);

    return c.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}