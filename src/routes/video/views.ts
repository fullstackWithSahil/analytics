import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { videoEvents } from "../../db/schema";
import { and, eq } from "drizzle-orm";

export async function getViews(c:Context){
    try {
        const {videoId} = c.req.param();
        if(!videoId){
            return c.json({
                success:false,
                message:"Video id was not provided"
            })
        }

        const db = drizzle(c.env.DB);
        const views = await db
            .selectDistinct({
                studentId: videoEvents.student
            })
            .from(videoEvents)
            .where(
                and(
                    eq(videoEvents.lessonId, +videoId),
                    eq(videoEvents.event,"progress"),
                )
            );

        return c.json({
            success:true,
            data:views.length,
            message:"views fetched successfully",
        })
    } catch (error) {
        console.log("There was an error getting views",error);
        return c.json({
            success: false,
            message: "Internal Server Error",
        },500);
    }
}