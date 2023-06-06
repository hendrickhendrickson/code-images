<script lang="ts">
	import { goto } from '$app/navigation';
	import LoginModal from './login/login.modal.svelte';
	import Button, { Label } from '@smui/button';
</script>

<svelte:head>
	<title>Code-Images Home</title>
	<meta name="description" content="Code-Images home page " />
</svelte:head>

<main>
	<LoginModal />
	<div style="text-align: center">
		<Button on:click={() => goto('/game/createRoom')} variant="outlined">
			<Label>Create Room</Label>
		</Button>
	</div>
</main>

<style>
</style>
