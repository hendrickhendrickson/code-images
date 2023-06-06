<script lang="ts">
	import Card, { Content } from '@smui/card';
	import List, { Item, Text } from '@smui/list';

	export let operatives: Array<string>;
	export let spymasters: Array<string>;
</script>

<div class="card-display">
	<div class="card-container">
		<Card>
			<Content component={List}>
				<Item>
					<Text>Operatives:</Text>
				</Item>
				{#each operatives as operative}
					<Item on:click={() => {}}>
						<Text>{operative}</Text>
					</Item>
				{/each}
				<Item>
					<Text>Spymasters:</Text>
				</Item>
				{#each spymasters as spymaster}
					<Item on:click={() => {}}>
						<Text>{spymaster}</Text>
					</Item>
				{/each}
			</Content>
		</Card>
	</div>
</div>

<style>
</style>
