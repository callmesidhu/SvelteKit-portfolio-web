<script lang="ts">
  import { onMount } from 'svelte';

  let { text = '', delay = 100, direction = 'bottom' }: {
    text: string;
    delay?: number;
    direction?: 'bottom' | 'top';
  } = $props();

  let words = $derived(text.split(' '));
  let container: HTMLDivElement;
  let triggered = $state(false);

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          triggered = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  });
</script>

<div bind:this={container} class="overflow-visible">
  {#each words as word, i}
    <span
      class="inline-block overflow-visible"
      style:transition-property="filter, opacity, transform"
      style:transition-timing-function="cubic-bezier(0.16, 1, 0.3, 1)"
      style:transition-duration="0.55s"
      style:transition-delay="{i * delay}ms"
      style:filter={triggered ? 'blur(0px)' : 'blur(10px)'}
      style:opacity={triggered ? '1' : '0'}
      style:transform={triggered
        ? 'translateY(0)'
        : direction === 'bottom'
          ? 'translateY(40px)'
          : 'translateY(-40px)'}
    >{word}</span>{#if i < words.length - 1}&nbsp;{/if}
  {/each}
</div>
