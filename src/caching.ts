import { Context, Next } from "hono";

export async function caching(c: Context<{ Bindings: CloudflareBindings }>, next: Next) {
    try {
        const organization = c.req.query("organization");
        const path = c.req.path;
        const cahceddata = await c.env.KV.get(`${path}/${organization}`);
        if (!cahceddata) {
            console.log("cache miss")
            await next();
            if (c.res.body) {
                const cloned = c.res.clone();
                const dataToCache = await cloned.json();
                c.env.KV.put(`${path}/${organization}`, JSON.stringify(dataToCache))
            }
        } else {
            console.log("cache hit")
            return c.json(JSON.parse(cahceddata));
        }
    } catch (e) {
        console.error(e);
        await next()
    }
}