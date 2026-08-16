import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";


export const Payments = sqliteTable("payments", {
    id:integer("id").primaryKey({ autoIncrement: true }),
    teacher: text("teacher").notNull(),
    product: integer("product").notNull(),
    productName: text("productName").notNull(),
    productType:text("productType").notNull(),
    expiresAt:text("expiresAt").notNull(),
    tier:text("tier").notNull(),
    student:text("student").notNull(),
    paymentType:text("paymentType").notNull(),
    price:integer("price").notNull().default(0),
    createdAt: text("created_at")
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`)
})

export const videoEvents = sqliteTable("video_events", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
    teacher: text("teacher").notNull(),
    student: text("student").notNull(),
    courseId: integer("course_id").notNull(),
    lessonId: integer("lesson_id").notNull(),
    videoId: text("video_id").notNull(),
    sessionId: text("session_id").notNull(),
    event: text("event", {
        enum: [
        "play",
        "pause",
        "progress",
        "seek",
        "ended",
        ],
    }).notNull(),
    currentTime: real("current_time").notNull(),
    duration: real("duration").notNull(),
    seekFrom: real("seek_from"),
    seekTo: real("seek_to"),
    playbackRate: real("playback_rate"),
    volume: integer("volume"),
    muted: integer("muted", { mode: "boolean" }),
});