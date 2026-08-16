import { createClient } from "@supabase/supabase-js";
import { Context } from "hono";

export async function leadsGrowth(c:Context) {
  try {
    const supabase = createClient(
      c.env.NEXT_PUBLIC_SUPABASE_URL,
      c.env.SUPABASE_SECRET,
    );

    const teacher = c.req.query("teacher");

    const start = new Date();
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("leads")
      .select("created_at")
      .eq("teacher", teacher)
      .gte("created_at", start.toISOString())
      .order("created_at");

    if (error) throw error;

    const map = new Map<string, number>();

    for (let i = 0; i < 30; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      const key = date.toISOString().split("T")[0];

      map.set(key, 0);
    }

    data.forEach((lead) => {
      const key = lead.created_at.split("T")[0];

      if (map.has(key)) {
        map.set(key, (map.get(key) ?? 0) + 1);
      }
    });

    const result = [...map.entries()].map(([date, leads]) => ({
      date,
      leads,
    }));

    return c.json(result);
  } catch (e) {
    console.log(e);

    return c.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
