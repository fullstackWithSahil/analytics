import { createClient } from "@supabase/supabase-js";
import { Context } from "hono";

export async function getLeadsOverview(c:Context) {
    try {
        const supabase = createClient(c.env.NEXT_PUBLIC_SUPABASE_URL,c.env.SUPABASE_SECRET);
        const teacher = c.req.query("teacher");

        const today = new Date();
        const todayStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
        ).toISOString();

        const monthStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            1,
        ).toISOString();

        const [totalLeads, todayLeads, monthLeads, qualifiedLeads, wonLeads] =
            await Promise.all([
                supabase
                    .from("leads")
                    .select("*", { count: "exact", head: true })
                    .eq("teacher", teacher),

                supabase
                    .from("leads")
                    .select("*", { count: "exact", head: true })
                    .eq("teacher", teacher)
                    .gte("created_at", todayStart),

                supabase
                    .from("leads")
                    .select("*", { count: "exact", head: true })
                    .eq("teacher", teacher)
                    .gte("created_at", monthStart),

                supabase
                    .from("leads")
                    .select("*", { count: "exact", head: true })
                    .eq("teacher", teacher)
                    .eq("status", "qualified"),

                supabase
                    .from("leads")
                    .select("*", { count: "exact", head: true })
                    .eq("teacher", teacher)
                    .eq("status", "won"),
            ]);

        const total = totalLeads.count ?? 0;
        const won = wonLeads.count ?? 0;

        return c.json({
            totalLeads: total,
            todayLeads: todayLeads.count ?? 0,
            monthLeads: monthLeads.count ?? 0,
            qualifiedLeads: qualifiedLeads.count ?? 0,
            wonLeads: won,
            conversionRate:
                total === 0 ? 0 : Number(((won / total) * 100).toFixed(1)),
        });
    } catch (err) {
        console.error(err);
        return c.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
}
