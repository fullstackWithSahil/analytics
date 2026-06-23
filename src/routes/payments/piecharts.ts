import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { Payments } from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function revenuePieByType(c: Context) {
    try {
        const db = drizzle(c.env.DB);
        const teacher = c.req.query("teacher");
        if (!teacher) {
            return c.json({
                success: false,
                message: "Teacher is a required field",
            });
        }
        const rows = await db
            .select({
                count: sql<number>`cast(count(${Payments.id}) as int)`,
                price: Payments.price,
                type: Payments.productType,
            })
            .from(Payments)
            .where(eq(Payments.teacher, teacher))
            .groupBy(Payments.productType);

        const payload = rows.map((iteam) => {
            return {
                name: iteam.type,
                revenue: iteam.count * iteam.price,
            };
        });
        return c.json({ success: true, data: payload });
    } catch (e) {
        console.log(e);
        return c.json({ success: false });
    }
}

export async function revenuePieByProduct(c: Context) {
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
                .select({
                    count: sql<number>`cast(count(${Payments.id}) as int)`,
                    price: Payments.price,
                    name: Payments.productName,
                })
                .from(Payments)
                .where(
                    and(
                        eq(Payments.teacher, teacher),
                        eq(Payments.productType,product)
                    )
                )
                .groupBy(Payments.productName);
            const payload = rows.map((iteam) => {
                return {
                    name: iteam.name,
                    revenue: iteam.count * iteam.price,
                };
            });
            return c.json({ success: true, data: payload });
        } else {
            const rows = await db
                .select({
                    count: sql<number>`cast(count(${Payments.id}) as int)`,
                    price: Payments.price,
                    name: Payments.productName,
                })
                .from(Payments)
                .where(eq(Payments.teacher, teacher))
                .groupBy(Payments.productName);
            const payload = rows.map((iteam) => {
                return {
                    name: iteam.name,
                    revenue: iteam.count * iteam.price,
                };
            });
            return c.json({ success: true, data: payload });
        }
    } catch (e) {
        console.log(e);
        return c.json({ success: false });
    }
}