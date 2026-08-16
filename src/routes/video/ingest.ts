import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { videoEvents } from "../../db/schema";

export async function ingestVideoEvents(c:Context){
  try {
    const body = await c.req.json();

    // if (!parsed.success) {
    //   return c.json({
    //     success: false,
    //     errors: parsed.error.flatten(),
    //     },400);
    // }

    const db = drizzle(c.env.DB);

    console.log(body);
    await db.insert(videoEvents).values(body);

    return c.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return c.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      500
    );
  }
}

// insert into "video_events" 
// ("id", "created_at", "teacher", "student", "course_id", "lesson_id", "video_id", "session_id", "event", "current_time", "duration", "seek_from", "seek_to", "playback_rate", "volume", "muted", "device", "browser", "os", "ip", "country") values 
// (null, ?, ?, null, null, null, ?, null, ?, ?, ?, null, null, null, null, null, null, null, null, null, null)