<script lang="ts">
	import Card, { Content } from '@smui/card';
	import List, { Item, Text } from '@smui/list';

	export let teamName: string;
	export let teamColor: string | null;
	export let operatives: Array<string>;
	export let spymasters: Array<string>;
	export let points: number;
	export let pointsGoal: number;
	export let player: string;
</script>

<div class="card-display">
	<div class="card-container">
		<Card>
			<Content component={List}>
				<Item>
					<Text style={`color: ${teamColor}`}
						>{`${teamName} —  Points: ${points}/${pointsGoal}`}</Text
					>
				</Item>
				<Item>
					<Text style={`color: ${teamColor}`}>Operatives:</Text>
				</Item>
				{#each operatives as operative}
					<Item>
						<Text
							style={operative === player ? `font-weight: bold; text-decoration: underline;` : ''}
							>{operative}</Text
						>
					</Item>
				{/each}
				<Item>
					<Text style={`color: ${teamColor}`}>Spymasters:</Text>
				</Item>
				{#each spymasters as spymaster}
					<Item>
						<Text
							style={spymaster === player ? `font-weight: bold; text-decoration: underline;` : ''}
							>{spymaster}</Text
						>
					</Item>
				{/each}
			</Content>
		</Card>
	</div>
</div>

<style>
</style>
