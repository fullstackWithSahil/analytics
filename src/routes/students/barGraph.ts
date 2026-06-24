import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { Payments } from "../../db/schema";
import { and, eq, gte, sql } from "drizzle-orm";

export async function studentsBarGraphByProduct(c: Context) {
    try {
        const db = drizzle(c.env.DB);
        const teacher = c.req.query("teacher");
        if (!teacher) {
            return c.json({
                success: false,
                message: "Teacher is required",
            });
        }

        const product = c.req.query("product");

        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const firstPurchases = db
            .select({
                student: Payments.student,
                productName: Payments.productName,
                firstPurchase: sql<string>`
                    MIN(${Payments.createdAt})
                `.as("firstPurchase"),
            })
            .from(Payments)
            .where(
                product
                    ? and(
                          eq(Payments.teacher, teacher),
                          eq(Payments.productType, product)
                      )
                    : eq(Payments.teacher, teacher)
            )
            .groupBy(
                Payments.student,
                Payments.productName
            )
            .as("first_purchases");

        const rows = await db
            .select({
                month: sql<string>`
                    strftime('%Y-%m', ${firstPurchases.firstPurchase})
                `.as("month"),
                productName: firstPurchases.productName,
                count: sql<number>`
                    CAST(COUNT(*) AS INTEGER)
                `.as("count"),
            })
            .from(firstPurchases)
            .where(
                gte(
                    firstPurchases.firstPurchase,
                    oneYearAgo
                        .toISOString()
                        .slice(0, 19)
                        .replace("T", " ")
                )
            )
            .groupBy(
                sql`strftime('%Y-%m', ${firstPurchases.firstPurchase})`,
                firstPurchases.productName
            );

        const products = [
            ...new Set(
                rows
                    .map((row) => row.productName)
                    .filter(Boolean)
            ),
        ];

        const result: any[] = [];

        const now = new Date();

        for (let i = 11; i >= 0; i--) {
            const date = new Date(
                now.getFullYear(),
                now.getMonth() - i,
                1
            );

            const month = `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;

            const entry: any = {
                month,
            };

            products.forEach((productType) => {
                entry[productType] = 0;
            });

            result.push(entry);
        }

        rows.forEach((row) => {
            const monthEntry = result.find(
                (r) => r.month === row.month
            );

            if (monthEntry && row.productName) {
                monthEntry[row.productName] = Number(row.count);
            }
        });

        return c.json({
            success: true,
            products,
            data: result,
        });
    } catch (e) {
        console.log(e);
        return c.json({ success: false });
    }
}

export async function studentsBarGraphByProductType(c: Context) {
    try {
        const db = drizzle(c.env.DB);
        const teacher = c.req.query("teacher");
        if (!teacher) {
            return c.json({
                success: false,
                message: "Teacher is required",
            });
        }

        const product = c.req.query("product");

        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const firstPurchases = db
            .select({
                student: Payments.student,
                productType: Payments.productType,
                firstPurchase: sql<string>`
                    MIN(${Payments.createdAt})
                `.as("firstPurchase"),
            })
            .from(Payments)
            .where(
                product
                    ? and(
                          eq(Payments.teacher, teacher),
                          eq(Payments.productType, product)
                      )
                    : eq(Payments.teacher, teacher)
            )
            .groupBy(
                Payments.student,
                Payments.productType
            )
            .as("first_purchases");

        const rows = await db
            .select({
                month: sql<string>`
                    strftime('%Y-%m', ${firstPurchases.firstPurchase})
                `.as("month"),
                productType: firstPurchases.productType,
                count: sql<number>`
                    CAST(COUNT(*) AS INTEGER)
                `.as("count"),
            })
            .from(firstPurchases)
            .where(
                gte(
                    firstPurchases.firstPurchase,
                    oneYearAgo
                        .toISOString()
                        .slice(0, 19)
                        .replace("T", " ")
                )
            )
            .groupBy(
                sql`strftime('%Y-%m', ${firstPurchases.firstPurchase})`,
                firstPurchases.productType
            );

        const products = [
            ...new Set(
                rows
                    .map((row) => row.productType)
                    .filter(Boolean)
            ),
        ];

        const result: any[] = [];

        const now = new Date();

        for (let i = 11; i >= 0; i--) {
            const date = new Date(
                now.getFullYear(),
                now.getMonth() - i,
                1
            );

            const month = `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;

            const entry: any = {
                month,
            };

            products.forEach((productType) => {
                entry[productType] = 0;
            });

            result.push(entry);
        }

        rows.forEach((row) => {
            const monthEntry = result.find(
                (r) => r.month === row.month
            );

            if (monthEntry && row.productType) {
                monthEntry[row.productType] = Number(row.count);
            }
        });

        return c.json({
            success: true,
            products,
            data: result,
        });
    } catch (error) {
        console.error(error);

        return c.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            500
        );
    }
}