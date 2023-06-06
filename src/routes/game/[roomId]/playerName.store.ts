import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const playerNameStore = writable(browser ? localStorage.getItem('playerName') : null);
