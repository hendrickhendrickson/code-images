<script lang="ts">
    import { onMount } from "svelte";

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
    <div class="header">
        <div class="game-name">
            <h1>Code-Images</h1>
        </div>

        <div class="logo">LOGO</div>
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

                <button>Enter</button>
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
                    <button type="button">Create Room</button>
                </li>
            </ul>
        {/if}
    {/if}
</div>

<style>
    .game-start-screen {
        box-sizing: border-box;
        height: 100%;
        padding: 0 10rem;
    }

    .header {
        display: flex;
        height: 50%;
    }

    .header .game-name {
        flex: 1;
        display: flex;
        align-items: center;
    }

    .header .game-name h1 {
        margin: 0;
    }

    .header .logo {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .player-name-form {
        height: 10%;
        min-height: fit-content;
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    ul.game-menu {
        margin: 0;
        padding: 0;
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: 2rem;
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
    }
</style>
