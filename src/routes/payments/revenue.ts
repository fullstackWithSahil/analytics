import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { Payments } from "../../db/schema";
import { and, eq, gte, sql } from "drizzle-orm";

export async function getBarChart(c: Context) {
    try {
        const db = drizzle(c.env.DB);

        const teacher = c.req.query("teacher");

        if (!teacher) {
            return c.json({
                success: false,
                message: "Teacher is a required field",
            });
        }

        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const rows = await db
            .select({
                month: sql<string>`strftime('%Y-%m', ${Payments.createdAt})`,
                revenue: sql<number>`COALESCE(sum(${Payments.price}), 0)`,
            })
            .from(Payments)
            .where(
                and(
                    eq(Payments.teacher, teacher),
                    gte(
                        Payments.createdAt,
                        oneYearAgo.toISOString().slice(0, 19).replace("T", " "),
                    ),
                ),
            )
            .groupBy(sql`strftime('%Y-%m', ${Payments.createdAt})`)
            .orderBy(sql`strftime('%Y-%m', ${Payments.createdAt})`);

        const result: {
            month: string;
            revenue: number;
        }[] = [];

        const currentDate = new Date();

        for (let i = 11; i >= 0; i--) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - i,
                1,
            );

            const monthKey = `${date.getFullYear()}-${String(
                date.getMonth() + 1,
            ).padStart(2, "0")}`;

            const existing = rows.find((row) => row.month === monthKey);

            result.push({
                month: monthKey,
                revenue: existing ? Number(existing.revenue) : 0,
            });
        }

        return c.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error(error);

        return c.json(
            {
                success: false,
                message: "Internal server error",
            },
            500,
        );
    }
}

export async function getRevenueByProductType(c: Context) {
    try {
        const db = drizzle(c.env.DB);
        const teacher = c.req.query("teacher");
        if (!teacher) {
            return c.json({
                success: false,
                message: "Teacher is required",
            });
        }
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const rows = await db
            .select({
                month: sql<string>`
          strftime('%Y-%m', ${Payments.createdAt})
        `,
                productType: Payments.productType,
                revenue: sql<number>`
          COALESCE(sum(${Payments.price}), 0)
        `,
            })
            .from(Payments)
            .where(
                and(
                    eq(Payments.teacher, teacher),
                    gte(
                        Payments.createdAt,
                        oneYearAgo.toISOString().slice(0, 19).replace("T", " "),
                    ),
                ),
            )
            .groupBy(
                sql`strftime('%Y-%m', ${Payments.createdAt})`,
                Payments.productType,
            );

        const current = new Date();
        const result: {
            month: string;
            courses: number;
            communities: number;
            digital: number;
        }[] = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date(
                current.getFullYear(),
                current.getMonth() - i,
                1,
            );

            const month = `${date.getFullYear()}-${String(
                date.getMonth() + 1,
            ).padStart(2, "0")}`;

            result.push({
                month,
                courses: 0,
                communities: 0,
                digital: 0,
            });
        }
        for (const row of rows) {
            const monthData = result.find((m) => m.month === row.month);
            if (!monthData) continue;
            switch (row.productType) {
                case "courses":
                    monthData.courses = Number(row.revenue);
                    break;
                case "communities":
                    monthData.communities = Number(row.revenue);
                    break;
                case "digital":
                    monthData.digital = Number(row.revenue);
                    break;
            }
        }

        return c.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error(error);

        return c.json(
            {
                success: false,
                message: "Internal server error",
            },
            500,
        );
    }
}

export async function getRevenueByProductName(c: Context) {
    try {
        const db = drizzle(c.env.DB);
        const teacher = c.req.query("teacher");
        if (!teacher) {
            return c.json({
                success: false,
                message: "Teacher is required",
            });
        }
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const product = c.req.query("product");
        let rows;
        if (product) {
            rows = await db
                .select({
                    month: sql<string>`
            strftime('%Y-%m', ${Payments.createdAt})
            `,
                    productName: Payments.productName,
                    revenue: sql<number>`
            COALESCE(sum(${Payments.price}),0)
            `,
                })
                .from(Payments)
                .where(
                    and(
                        eq(Payments.productType,product),
                        eq(Payments.teacher, teacher),
                        gte(
                            Payments.createdAt,
                            oneYearAgo.toISOString().slice(0, 19).replace("T", " "),
                        ),
                    ),
                )
                .groupBy(
                    sql`strftime('%Y-%m', ${Payments.createdAt})`,
                    Payments.productName,
                );
        } else {
            rows = await db
                .select({
                    month: sql<string>`
            strftime('%Y-%m', ${Payments.createdAt})
            `,
                    productName: Payments.productName,
                    revenue: sql<number>`
            COALESCE(sum(${Payments.price}),0)
            `,
                })
                .from(Payments)
                .where(
                    and(
                        eq(Payments.teacher, teacher),
                        gte(
                            Payments.createdAt,
                            oneYearAgo.toISOString().slice(0, 19).replace("T", " "),
                        ),
                    ),
                )
                .groupBy(
                    sql`strftime('%Y-%m', ${Payments.createdAt})`,
                    Payments.productName,
                );
        }
        const products = [...new Set(rows.map((row) => row.productName))];
        const result: any[] = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = `${date.getFullYear()}-${String(
                date.getMonth() + 1,
            ).padStart(2, "0")}`;
            const entry: any = {
                month,
            };
            products.forEach((product) => {
                entry[product] = 0;
            });
            result.push(entry);
        }
        rows.forEach((row) => {
            const month = result.find((r) => r.month === row.month);
            if (month) {
                month[row.productName] = Number(row.revenue);
            }
        });
        return c.json({
            success: true,
            products,
            data: result,
        });
    } catch (error) {
        console.error(error);
        return c.json({success: false},500);
    }
}
