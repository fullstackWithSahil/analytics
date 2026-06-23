import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { Payments } from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function studentsPieByProduct(c: Context) {
    try {
        const db = drizzle(c.env.DB);
        const teacher = c.req.query("teacher");
        if (!teacher) {
            return c.json({
                success: false,
                message: "Teacher is a required field",
            });
        }
        const product = c.req.query("product");
        if (product) {
            const rows = await db
                .selectDistinct({
                    count: sql<number>`cast(count(${Payments.student}) as int)`,
                    name:Payments.productName,
                })
                .from(Payments)
                .where(
                    and(
                        eq(Payments.teacher, teacher),
                        eq(Payments.productType,product)
                    )
                )
                .groupBy(Payments.productName);
            return c.json({ success: true, data: rows });
        } else {
            const rows = await db
                .selectDistinct({
                    count: sql<number>`cast(count(${Payments.id}) as int)`,
                    name:Payments.productName,
                })
                .from(Payments)
                .where(eq(Payments.teacher, teacher))
                .groupBy(Payments.productName);
            
            return c.json({ success: true, data: rows });
        }
    } catch (e) {
        console.log(e);
        return c.json({ success: false });
    }
}