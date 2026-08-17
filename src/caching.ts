import { Context, Next } from "hono";

export async function caching(c: Context<{ Bindings: CloudflareBindings }>, next: Next) {
    try {
        const organization = c.req.query("organization");
        const path = c.req.path;
        const cahceddataJson = await c.env.KV.get(`${path}/${organization}`);
        const cahceddata = JSON.parse(cahceddataJson || "");

        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (
            !cahceddata ||
            !cahceddata.date ||
            yesterday < cahceddata.date
        ) {
            console.log("cache miss")
            await next();
            if (c.res.body) {
                const cloned = c.res.clone();
                const dataToCache = await cloned.json();
                c.env.KV.put(`${path}/${organization}`, JSON.stringify({
                    data: dataToCache,
                    date: new Date(Date.now())
                }))
            }
        } else {
            return c.json(cahceddata.data);
        }
    } catch (e) {
        console.error(e);
        await next()
    }
}

//{ today: 2026-08-17T07:55:34.078Z }
//{ yesterday: 2026-08-16T07:57:50.821Z 