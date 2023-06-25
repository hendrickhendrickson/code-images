<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    export let form;

    let playerName = "";
    let isChangingPlayerName = false;

    let isMounted = false;

    onMount(() => {
        playerName = localStorage.getItem("playerName") ?? "";

        if (!playerName || playerName.length < 3) {
            isChangingPlayerName = true;
        }

        isMounted = true;
    });

    function handlePlayerNameSubmit(event: SubmitEvent) {
        const formEl = event.target as HTMLFormElement | null;

        if (formEl) {
            playerName = formEl["player-name-input"].value;

            if (playerName && playerName.length >= 3) {
                isChangingPlayerName = false;
                localStorage.setItem("playerName", playerName);
            }
        }
    }
</script>

<div class="game-start-screen">

    <div class="game-name-and-menu-wrapper">
        <div class="game-name">
            <h1>Code Images</h1>
        </div>

        {#if isMounted}
            {#if isChangingPlayerName || !playerName}
                <form class="player-name-form" on:submit|preventDefault={handlePlayerNameSubmit}>
                    <input
                        type="text"
                        id="player-name-input"
                        name="player-name-input"
                        placeholder="Enter Player Name"
                        value={playerName}
                    />

                    <button>Submit</button>
                </form>
            {:else}
                <ul class="game-menu">
                    <li class="change-player-name-option">
                        {playerName}

                        <button
                            type="button"
                            class="inverted"
                            on:click={() => isChangingPlayerName = true}
                        >
                            Change Player Name
                        </button>
                    </li>

                    <li>
                        <form class="room-url-form" method="POST" use:enhance>
                            {#if form?.roomId}
                                <div class="input-like">
                                    {$page.url.protocol}//{$page.url.host}/game/{form?.roomId}
                                </div>

                                <div style="display: flex; gap: 1rem;">
                                    <a
                                        href={`${$page.url.protocol}//${$page.url.host}/game/${form?.roomId}`}
                                        class="button"
                                        role="button"
                                        target="_self"
                                    >
                                        Join room
                                    </a>

                                    <button>Create new room</button>
                                </div>
                            {:else}
                                <button>Create room</button>
                            {/if}
                        </form>
                    </li>
                </ul>
            {/if}
        {/if}
    </div>

    <div class="game-logo-wrapper">
        <div class="logo-placeholder">
            Hier könnte ihr Logo stehen!<br />
            Just sayin'...
        </div>
    </div>
</div>

<style>
    .game-start-screen {
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 50% 50%;
        gap: 2rem;
        height: 100%;
        margin: 0 auto;
        width: 80%;
    }

    .game-name-and-menu-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
    }

    .game-name h1 {
        margin: 0 0 4rem 0;
        text-transform: uppercase;
    }

    ul.game-menu {
        margin: 0;
        padding: 0;
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    ul.game-menu .change-player-name-option {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    ul.game-menu .change-player-name-option button {
        border-radius: 0.4rem;
        padding: 0.1rem 0.4rem;
        font-size: 0.8rem;
        min-height: unset;
    }

    ul.game-menu .room-url-form {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .game-logo-wrapper {
        display: flex;
        align-items: center;
    }

    .game-logo-wrapper .logo-placeholder {
        box-sizing: border-box;
        padding: 2rem;
        text-transform: uppercase;
        aspect-ratio: 1/1;
        border: 1px solid var(--white-hex);
        display: flex;
        align-items: center;
        justify-content: center;
        max-height: 100%;
    }

    @media only screen and (max-width: 800px) {
        .game-start-screen {
            grid-template-columns: 100%;
            grid-template-rows: 30% max-content;
            min-width: fit-content;
            gap: 4rem;
            padding-top: 4rem;
        }

        .game-logo-wrapper {
            grid-row: 1/2;
            display: block;

        }

        .game-logo-wrapper .logo-placeholder {
            margin: 0 auto;
        }

        .game-name-and-menu-wrapper {
            grid-row: 2/3;
            justify-content: flex-start;
        }

        .game-name h1 {
            margin: 0 0 2rem 0;
        }
    }

    @media only screen and (max-width: 420px) {
        .game-start-screen {
            margin: 0 2rem;
        }
    }
</style>
