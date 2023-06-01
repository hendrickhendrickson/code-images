<script lang="ts">
	import Dialog, { Title, Content, Actions, InitialFocus } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import TextFieldIcon from '@smui/textfield/icon';
	import { playerNameStore } from '../[roomId]/playerName.store';

	let open = !$playerNameStore;
	let username = '';
</script>

<Dialog bind:open aria-labelledby="default-focus-title" aria-describedby="default-focus-content">
	<Title id="default-focus-title">Login</Title>
	<Content id="default-focus-content" style="padding-top: 10px">
		<Textfield variant="outlined" bind:value={username} label="Username" width="600px">
			<TextFieldIcon class="material-icons" slot="leadingIcon">badge</TextFieldIcon>
		</Textfield>
	</Content>
	<Actions>
		<Button on:click={() => {}}>
			<Label>Cancel</Label>
		</Button>
		<Button
			defaultAction
			use={[InitialFocus]}
			on:click={() => {
				playerNameStore.set(username);
				localStorage.setItem('playerName', username);
			}}
		>
			<Label>Play</Label>
		</Button>
	</Actions>
</Dialog>

{#if !$playerNameStore}
	<Button variant="outlined" on:click={() => (open = true)}>
		<Label>Login</Label>
	</Button>
{/if}
