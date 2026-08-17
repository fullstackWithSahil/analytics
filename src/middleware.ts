import { getAuth } from "@clerk/hono";
import { Context, Next } from "hono";

export async function middleware(c: Context, next: Next) {
    try {
        const user = getAuth(c);
        if (!user?.userId) {
            return c.json({
                success: false,
                message: "You are not logged in"
            }, 401);
        }
        const organization = c.req.query("organization");
        if (user.orgId != organization) {
            return c.json({
                success: false,
                message:"You are not allowed to see this resource"
            }, 401)
        }
        await next();
    } catch (err) {
        console.error(err);
        return c.json({
            success: false,
            error: "Internal Server Error"
        }, 500);
    }
}