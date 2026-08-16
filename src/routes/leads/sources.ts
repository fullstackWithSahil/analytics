import { createClient } from "@supabase/supabase-js";
import { Context } from "hono";

export async function leadSources(c:Context) {
  try {
    const supabase = createClient(
      c.env.NEXT_PUBLIC_SUPABASE_URL,
      c.env.SUPABASE_SECRET,
    );

    const teacher = c.req.query("teacher");

    const { data, error } = await supabase
      .from("leads")
      .select("source")
      .eq("teacher", teacher);

    if (error) throw error;

    const counts = new Map<string, number>();

    data.forEach((lead) => {
      const source = lead.source?.trim() || "Unknown";

      counts.set(source, (counts.get(source) ?? 0) + 1);
    });

    const result = [...counts.entries()]
      .map(([source, leads]) => ({
        source,
        leads,
      }))
      .sort((a, b) => b.leads - a.leads);

    return c.json(result);
  } catch (e) {
    console.log(e);

    return c.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}