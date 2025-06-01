<script setup lang="ts">
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";

const route = useRoute();

const id = route.params.id;

const replayerRef = useTemplateRef("replayer");

const {} = useLazyAsyncData(`events-${id}`, async () => {
  const data = await $fetch(`/api/replay/${id}`);

  if (replayerRef.value) {
    new rrwebPlayer({
      target: replayerRef.value,
      props: {
        events: data.events,
      },
    });
  }
});
</script>

<template>
  <div class="min-h-screen p-4">
    <div ref="replayer" id="replayer"></div>
  </div>
</template>
