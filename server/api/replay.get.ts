export default defineEventHandler(async (event) => {
  const eventIds = await useStorage("db").getKeys();

  return {
    success: true,
    eventIds,
  };
});
