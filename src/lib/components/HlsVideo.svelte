<script lang="ts">
  import { onMount } from 'svelte';

  let { src }: { src: string } = $props();
  let videoEl: HTMLVideoElement;

  onMount(async () => {
    if (!videoEl) return;

    if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS (Safari)
      videoEl.src = src;
    } else {
      const Hls = (await import('hls.js')).default;
      if (Hls.isSupported()) {
        const hls = new Hls({ autoStartLoad: true });
        hls.loadSource(src);
        hls.attachMedia(videoEl);
      }
    }
  });
</script>

<video
  bind:this={videoEl}
  autoplay
  loop
  muted
  playsinline
  class="absolute inset-0 h-full w-full object-cover"
></video>
