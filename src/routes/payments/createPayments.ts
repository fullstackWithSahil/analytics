import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { Payments } from "../../db/schema";

export async function createPayments(c:Context) {
    try {
        const body = await c.req.json();
        const {
            productName,
            product,
            productType,
            price,
            expiresAt,
            tier,
            teacher,
            student
        } = body;
        const db = drizzle(c.env.DB);
        const data = await db.insert(Payments).values({
            productName,
            product,
            productType,
            price,
            expiresAt,
            tier,
            teacher,
            student,
        })
        return c.json({
            success: true,
            message:"Payment recorded succesfully",
        })
    } catch (e) {
        console.log(e);
        return c.json({
            success: false,
            message: "There was an error creating payment"
        })
    }
}