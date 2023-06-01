import { browser } from '$app/environment';
import { writable } from 'svelte/store';

if (browser) localStorage.removeItem('playerName');
export const playerNameStore = writable(browser ? localStorage.getItem('playerName') : null);
