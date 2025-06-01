import type { eventWithTime } from "@rrweb/types";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ status: 404, message: "Id is required." });
  }

  const events = await useStorage("db").getItem<eventWithTime[]>(id);

  if (!events) {
    throw createError({ status: 404, message: `${id} is not found.` });
  }

  return {
    events,
  };
});
