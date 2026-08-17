import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { Payments } from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function communitiesTierPie(c: Context) {
    try {
        const organization = c.req.query("organization");
        if (!organization) {
            return c.json({
                success: false,
                message: "organization is a required field",
            });
        }
        const db = drizzle(c.env.DB);
        const product = c.req.query("product");
        if (!product) {
            const rows = await db
                .select({
                    count: sql<number>`cast(count(distinct ${Payments.student}) as int)`,
                    name: Payments.tier,
                })
                .from(Payments)
                .where(
                    and(
                        eq(Payments.organization, organization),
                        eq(Payments.productType, "communities"),
                    ),
                )
                .groupBy(Payments.tier);
            return c.json({ success: true, data: rows });
        } else {
            const rows = await db
                .select({
                    count: sql<number>`cast(count(distinct ${Payments.student}) as int)`,
                    name: Payments.tier,
                })
                .from(Payments)
                .where(
                    and(
                        eq(Payments.organization, organization),
                        eq(Payments.productType, "communities"),
                        eq(Payments.productName, product),
                    ),
                )
                .groupBy(Payments.tier);
            return c.json({ success: true, data: rows });
        }
    } catch (e) {
        console.log(e);
        return c.json({ success: false });
    }
}

export async function getStudentsPieProductType(c: Context) {
    try {
        const db = drizzle(c.env.DB);
        const organization = c.req.query("organization");
        if (!organization) {
            return c.json({
                success: false,
                message: "organization is a required field",
            });
        }
        const rows = await db
            .select({
                count: sql<number>`cast(count(distinct ${Payments.student}) as int)`,
                name: Payments.productType,
            })
            .from(Payments)
            .where(eq(Payments.organization, organization))
            .groupBy(Payments.productType);
        return c.json({ success: true, data: rows });
    } catch (e) {
        console.log(e);
        return c.json({ success: false });
    }
}

export async function studentsPieByProduct(c: Context) {
    try {
        const db = drizzle(c.env.DB);
        const organization = c.req.query("organization");
        if (!organization) {
            return c.json({
                success: false,
                message: "organization is a required field",
            });
        }
        const product = c.req.query("product");
        if (product) {
            const rows = await db
                .select({
                    count: sql<number>`cast(count(distinct ${Payments.student}) as int)`,
                    name: Payments.productName,
                })
                .from(Payments)
                .where(
                    and(
                        eq(Payments.productType, product),
                        eq(Payments.organization, organization),
                    ),
                )
                .groupBy(Payments.productName);
            return c.json({ success: true, data: rows });
        } else {
            const rows = await db
                .select({
                    count: sql<number>`cast(count(distinct ${Payments.student}) as int)`,
                    name: Payments.productName,
                })
                .from(Payments)
                .where(eq(Payments.organization, organization))
                .groupBy(Payments.productName);
            return c.json({ success: true, data: rows });
        }
    } catch (e) {
        console.log(e);
        return c.json({ success: false });
    }
}
