<script lang="ts">
	import Card, { PrimaryAction, Media, MediaContent, Actions, ActionIcons } from '@smui/card';
	import IconButton, { Icon } from '@smui/icon-button';
	import Badge from '@smui-extra/badge';
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import { createEventDispatcher } from 'svelte';
	import { thumbnailImagePixelSize } from '../game.consts';

	const dispatch = createEventDispatcher();

	export let disabled = false;
	export let cardName: string;
	export let imageUrl: string;
	export let revealed: boolean;
	export let cardColor: string | null;
	export let imageColor: string | null;
	export let playerMarks: Array<string>;
	export let selfMarked: boolean;
	export let markColor: string | null;

	function toggleMark() {
		dispatch('toggleMark');
	}
	function pick() {
		dispatch('pick');
	}
	function viewDetailImage() {
		dispatch('viewDetailImage');
	}
</script>

<div class="card-display">
	<div class="card-container">
		<Card
			style={`${
				imageColor ? `outline: ${imageColor} solid 3px` : ''
			};width: ${thumbnailImagePixelSize}px;${cardColor ? ` background-color: ${cardColor};` : ``}`}
			variant="outlined"
		>
			<Badge position="inset" align="middle-start" color="secondary">{cardName}</Badge>
			{#if playerMarks.length > 0}
				<Badge
					position="middle"
					align="middle-end"
					style={`${markColor ? `background-color: ${markColor};` : ``}`}
					>{playerMarks.length}</Badge
				>
			{/if}
			<PrimaryAction on:click={() => viewDetailImage()}>
				<Media class="card-media-square" aspectRatio="square">
					<MediaContent>
						<Wrapper>
							<img
								src={imageUrl}
								alt="img"
								style={`width: ${thumbnailImagePixelSize}px;height: ${thumbnailImagePixelSize}px;${
									revealed ? `filter: url('#${imageColor}');` : ''
								}`}
							/>
							{#if playerMarks.length > 0}
								<Tooltip xPos="start" yPos="above">{playerMarks.join(', ')}</Tooltip>
							{/if}
						</Wrapper>
					</MediaContent>
				</Media>
			</PrimaryAction>
			<Actions>
				<ActionIcons>
					<IconButton {disabled} on:click={() => toggleMark()} aria-label="Mark" title="Mark">
						{#if selfMarked}
							<Icon class="material-icons" style={`${markColor ? `color: ${markColor};` : ``}`}
								>thumb_up</Icon
							>
						{:else}
							<Icon class="material-icons">thumb_up</Icon>
						{/if}
					</IconButton>
					<IconButton
						{disabled}
						class="material-icons"
						on:click={() => pick()}
						aria-label="Pick"
						title="Pick">touch_app</IconButton
					>
				</ActionIcons>
			</Actions>
		</Card>
	</div>
</div>

<style>
</style>
