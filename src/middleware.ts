import { getAuth } from "@clerk/hono";
import { Context, Next } from "hono";

export async function middleware(c: Context, next: Next) {
    try {
        const user = getAuth(c);
        console.log(user.userId)
        if (!user?.userId) {
            return c.json({
                success: false,
                message: "You are not logged in"
            }, 401);
        }
        await next();

        // Now the handler has already executed
        console.log(c.res);
        if (c.res.body) {
            const cloned = c.res.clone();
            console.log(await cloned.json());
        }
    } catch (err) {
        console.error(err);
        return c.json({
            success: false,
            error: "Internal Server Error"
        }, 500);
    }
}