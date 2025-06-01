import type { eventWithTime } from "@rrweb/types";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ eventId: string; events: eventWithTime[] }>(
    event
  );

  try {
    await useStorage("db").setItem(body.eventId, body.events);

    return { success: true, message: "Replay data saved successfully." };
  } catch (error) {
    console.error("Error saving replay data:", error);
    return {
      success: false,
      message: "Failed to save replay data.",
      error: error instanceof Error ? error.message : String(error),
    };
  }
});
