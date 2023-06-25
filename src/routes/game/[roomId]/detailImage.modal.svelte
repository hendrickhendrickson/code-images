<script lang="ts">
	import Dialog from '@smui/dialog';
	import { createEventDispatcher } from 'svelte';
	import { detailImagePixelSize } from '../game.consts';

	export let imageUrl: string | null;

	const dispatch = createEventDispatcher();

	$: open = !!imageUrl;
</script>

<Dialog
	bind:open
	aria-labelledby="default-focus-title"
	aria-describedby="default-focus-content"
	on:click={() => dispatch('close')}
>
	<img
		src={imageUrl}
		alt="img"
		style={`width: ${detailImagePixelSize}px;height: ${detailImagePixelSize}px;overflow-y: visible`}
	/>
</Dialog>
