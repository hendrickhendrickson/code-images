<script lang="ts">
	import { goto } from '$app/navigation';
	import LoginModal from '../login/login.modal.svelte';
	import Button, { Label } from '@smui/button';
</script>

<svelte:head>
	<title>Code-Images room not found</title>
	<meta name="description" content="Code-Images room not found page " />
</svelte:head>

<main>
	<div style="text-align: center">
		<h1>404 room not found</h1>
		<LoginModal />
		<Button on:click={() => goto('/game/createRoom')} variant="outlined">
			<Label>Create Room</Label>
		</Button>
	</div>
</main>

<style>
</style>
