<script lang="ts">
	import Button, { Label } from '@smui/button';
	import Card, { Actions, Content } from '@smui/card';
	import axios from 'axios';
	import { goto } from '$app/navigation';

	async function createRoom() {
		const response = await axios.post('/game/createRoom');
		const roomId = response.data;
		if (typeof roomId === 'string') {
			goto(`/game/${roomId}`);
		}
	}
</script>

<svelte:head>
	<title>Code-Images Create Room</title>
	<meta name="description" content="Code-Images create room page " />
</svelte:head>

<main>
	<div class="card-container">
		<Card>
			<Content>Create Room</Content>
			<Actions fullBleed>
				<Button on:click={createRoom}>
					<Label>Action</Label>
					<i class="material-icons" aria-hidden="true">arrow_forward</i>
				</Button>
			</Actions>
		</Card>
	</div>
</main>

<style>
</style>
