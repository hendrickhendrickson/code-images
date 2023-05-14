<script lang="ts">
	import CodeImageCard from './CodeImageCard.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="grid-container">
		{#each Array(25) as _unused, i}
			<CodeImageCard
				disabled={Math.random() < 0.45}
				playerGuesses={Math.random() > 0.5
					? []
					: Math.random() > 0.5
					? ['Hendrick Hendrickson']
					: ['Tom', 'Jan', 'Schoki', 'Hendrick Hendrickson']}
				imageUrl={`https://picsum.photos/seed/${Math.random()}/160`}
				selfGuessed={Math.random() < 0.15}
				on:toggleGuess={() => console.log('toggleGuess')}
				on:pick={() => console.log('pick')}
			/>
		{/each}
	</div>
</section>

<style>
	* :global(.card-media-square) {
		background-image: url(https://placehold.co/320x180?text=square);
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: repeat(5, 1fr);
		gap: 10px; /* Optional - adds spacing between cells */
	}
</style>
