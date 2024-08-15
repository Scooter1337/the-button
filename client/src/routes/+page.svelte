<script lang="ts">
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import Spinner from 'lucide-svelte/icons/loader-pinwheel';
	import { nanoid } from 'nanoid';
	import { cn } from '$lib/utils';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { HOST, PORT } from '../../../static';

	let id = $state('');
	let connected = $state<undefined | boolean>(undefined);
	let room = $state('');
	let name = $state('');
	let alert_open = $state(false);

	interface User {
		name: string;
		id: string;
		display_only: boolean;
	}

	// check localstorage for id, if not found, generate one with nanoid
	// store id in localstorage
	let saved_id = localStorage.getItem('id');
	if (!saved_id) {
		let new_id = nanoid();
		localStorage.setItem('id', new_id);
		id = new_id;
	} else {
		id = saved_id;
	}

	// save name in localstorage
	let saved_name = localStorage.getItem('name');
	if (saved_name) {
		name = saved_name;
	}
	let saved_room = localStorage.getItem('room');
	if (saved_room) {
		room = saved_room;
	}

	let curr_room = $state('');
	let curr_players = $state<User[]>();
	let room_pressed = $state(false);
	let room_who_pressed = $state<User | undefined>(undefined);
	let room_owner = $state<User | undefined>(undefined);
	let display_mode = $state(false);
	let pseudo_display_mode = $state(false);

	$effect(() => {
		localStorage.setItem('name', name);
		localStorage.setItem('room', room);
		localStorage.setItem('id', id);
	});

	let socket: ReturnType<typeof io>;

	const join_room = (room: string, name: string) => {
		if (!room) {
			toast.error('Please enter a room code');
			return;
		}

		if (!name) {
			toast.error('Please enter a name');
			return;
		}

		connected = false;
		socket = io(HOST + PORT, {
			query: {
				room: room,
				name: name,
				id
			}
		});
		socket.on('connect', () => {
			setTimeout(() => {
				if (!connected) {
					toast.error('Failed to connect to server');
					return;
				}
				toast.success('Connected to server');
			}, 100);
			connected = true;
			curr_room = room;
		});

		socket.on('connect_error', (err) => {
			console.error(err);
		});

		socket.on('disconnect', () => {
			connected = undefined;
			curr_room = '';
			display_mode = false;
			curr_players = [];
			room_owner = undefined;
			room_pressed = false;
			room_who_pressed = undefined;
		});

		socket.on(
			'group_players',
			(players: User[], owner: User, pressed: boolean, who_pressed: User, room_id: string) => {
				curr_players = players;
				room_owner = owner;
				room_pressed = pressed;
				room_who_pressed = who_pressed;
				curr_room = room_id;

				let me = players.find((player) => player.id === id);
				if (me) {
					display_mode = me.display_only;
				} else {
					socket.disconnect();
				}
			}
		);

		socket.on('button_pressed', (user: User) => {
			room_pressed = true;
			room_who_pressed = user;
			console.log(user + ' pressed the button');
		});

		socket.on('reset', () => {
			room_pressed = false;
			room_who_pressed = undefined;
		});
	};

	function click_button() {
		socket.emit('button_press', { name, id });
	}

	function leave_room() {
		socket.disconnect();
		connected = undefined;
		curr_players = [];
		curr_room = '';
		room_owner = undefined;
		room_pressed = false;
		room_who_pressed = undefined;
		display_mode = false;

		toast.info('Left room');
	}

	function set_display_only(mode: boolean) {
		display_mode = mode;
		socket.emit('set_display_only', mode);
	}

	let holdTimeout: number;

	function handleMouseDown() {
		holdTimeout = setTimeout(() => {
			alert_open = true;
		}, 5000); // 5 seconds
	}

	function handleMouseUp() {
		clearTimeout(holdTimeout);
	}
</script>

<div class="h-[100lvh] w-[100vw]">
	{#if (connected && !display_mode) || (connected && display_mode && pseudo_display_mode)}
		<div class="flex h-[100lvh] w-full grid-cols-3 flex-col gap-4 p-4 2xl:grid">
			<div class="col-span-2 flex items-center justify-center">
				<button
					class="bg-muted col-span-2 flex aspect-square w-[min(100%,600px)] items-center justify-center rounded-2xl shadow-2xl"
					onclick={click_button}
					disabled={room_pressed}
				>
					{#if room_pressed}
						<div
							class="pointer-events-none flex aspect-square w-[70vw] items-center justify-center rounded-full bg-[grey] text-3xl font-bold shadow-2xl"
						>
							PRESSED <br /> by <br />
							{room_who_pressed!.name}
						</div>
					{:else}
						<div
							class="flex aspect-square w-[min(70vw,400px)] items-center justify-center rounded-full bg-[red] text-5xl font-bold shadow-2xl"
						>
							PRESS ME
						</div>
					{/if}
				</button>
			</div>
			<Card.Root class="overflow-y-auto">
				<Card.Header>
					<Card.Title class="text-2xl">Group {curr_room}</Card.Title>
				</Card.Header>
				<Card.Content class="grid gap-2">
					{#if curr_players}
						{#each curr_players as player}
							<div class="grid grid-cols-3 gap-2">
								{#if !player.display_only || (room_owner && room_owner.id === id)}
									<div class="flex shrink-0 items-center overflow-x-auto text-xs">
										{player.name}
										{#if player.display_only}(Display Mode){/if}
										{#if player.id === id}(You){/if}
									</div>
									{#if room_owner && room_owner.id === id && player.id !== id}
										<Button
											variant="destructive"
											onclick={() => socket.emit('assign_owner', player.id)}
											class="w-full"
										>
											Assign Owner
										</Button>
										<Button
											variant="destructive"
											onclick={() => socket.emit('kick', player.id)}
											class="w-full"
										>
											Kick
										</Button>
									{/if}
								{/if}
							</div>
						{/each}
					{/if}
				</Card.Content>
				<Card.Footer class="w-full flex-col gap-4 xl:flex-row">
					<Button variant="destructive" onclick={leave_room} class="w-full">Leave</Button>
					{#if room_owner && room_owner.id === id}
						<Button
							variant="outline"
							onclick={() => socket.emit('reset')}
							class={cn('w-full')}
							disabled={!room_pressed}>Reset</Button
						>
					{/if}
					{#if display_mode}
						<Button variant="secondary" class="w-full" onclick={() => set_display_only(false)}
							>Display Mode</Button
						>
					{/if}
					{#if !display_mode}
						<Button variant="secondary" class="w-full" onclick={() => set_display_only(true)}
							>Display Mode</Button
						>
					{/if}
					{#if room_owner && room_owner.id === id}
						<Button
							variant="secondary"
							class="w-full"
							onclick={() => (pseudo_display_mode = !pseudo_display_mode)}
							>Toggle Pseudo ({pseudo_display_mode})</Button
						>
					{/if}
				</Card.Footer>
			</Card.Root>
		</div>
	{/if}
	{#if !connected}
		<div class="flex h-[100lvh] w-full items-center justify-center">
			<Card.Root class="w-full max-w-sm">
				<Card.Header>
					<Card.Title class="text-2xl" onmousedown={handleMouseDown} onmouseup={handleMouseUp}
						>Join Room</Card.Title
					>
					<Card.Description>Enter a room code below to enter.</Card.Description>
				</Card.Header>
				<Card.Content class="grid gap-4">
					<div class="grid gap-2">
						<Label for="name">Name</Label>
						<Input class="" id="name" type="name" placeholder="Name" required bind:value={name} />
					</div>
					<div class="grid gap-2">
						<Label for="roomcode">Room Code</Label>
						<Input id="roomcode" class="" bind:value={room} placeholder="Room Code" required />
					</div>
				</Card.Content>
				<Card.Footer>
					<Button class="w-full" on:click={() => join_room(room, name)}>
						{#if connected === undefined}
							Join Room
						{:else}
							<Spinner class="animate-spin" />
						{/if}
					</Button>
				</Card.Footer>
			</Card.Root>
		</div>
	{/if}
	{#if connected && display_mode && room_owner && room_owner.id === id && !pseudo_display_mode}
		<div class="grid h-[100lvh] w-full grid-cols-2 gap-4 p-4 xl:grid-cols-3">
			<Card.Root class="hidden min-h-[50vw] overflow-y-auto xl:block">
				<Card.Header>
					<Card.Title class="text-2xl">Group {curr_room}</Card.Title>
				</Card.Header>
				<Card.Content class="grid gap-2">
					{#if curr_players}
						{#each curr_players as player}
							{#if !player.display_only}
								<div>{player.name}</div>
							{/if}
						{/each}
					{/if}
				</Card.Content>
				<Card.Footer class="w-full gap-4">
					<Button variant="destructive" onclick={leave_room} class="w-full">Leave</Button>
					{#if room_owner && room_owner.id === id}
						<Button variant="secondary" class="w-full" onclick={() => set_display_only(false)}
							>Leave Display Mode</Button
						>
					{/if}
				</Card.Footer>
			</Card.Root>
			<div class="col-span-2 flex flex-col gap-4">
				{#if room_pressed}
					<div
						class="flex h-full w-full shrink-0 flex-col items-center justify-center gap-8 rounded-2xl p-8"
					>
						<div
							class="flex h-[480px] w-[480px] items-center justify-center rounded-full bg-[green]"
						>
							<span class="text-6xl font-bold">{room_who_pressed!.name}</span>
						</div>
						<Button
							variant="destructive"
							onclick={() => socket.emit('reset')}
							class={cn('h-20 w-full text-4xl')}>Reset</Button
						>
					</div>
				{:else}
					<div
						class="flex h-full w-full shrink-0 animate-pulse flex-col items-center justify-center rounded-2xl"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="480"
							height="480"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide-icon lucide lucide-loader-pinwheel shrink-0 animate-[spin_15s_linear_infinite]"
							><!----><path d="M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5 2.2 5 5 5 5-2.2 5-5"
							></path><!----><path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6"></path><!----><path
								d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6"
							></path><!----><circle cx="12" cy="12" r="10"></circle><!----><!----><!----></svg
						>
						<span>Waiting for button press...</span>
					</div>
				{/if}
			</div>
		</div>
		<Button variant="destructive" onclick={() => set_display_only(false)} class="w-full"
			>Leave Display Mode</Button
		>
		<Button
			variant="destructive"
			onclick={() => (pseudo_display_mode = !pseudo_display_mode)}
			class="w-full">Pseudo</Button
		>
	{/if}
	{#if connected && display_mode && room_owner && room_owner.id !== id && !pseudo_display_mode}
		<div class="grid h-[100lvh] w-full grid-cols-2 gap-4 p-4 xl:grid-cols-3">
			<Card.Root class="hidden min-h-[50vw] overflow-y-auto xl:block">
				<Card.Header>
					<Card.Title class="text-2xl">Group {curr_room}</Card.Title>
				</Card.Header>
				<Card.Content class="grid gap-2">
					{#if curr_players}
						{#each curr_players as player}
							{#if player.display_only}
								<div>{player.name} (display mode)</div>
							{:else}
								<div>{player.name}</div>
							{/if}
						{/each}
					{/if}
				</Card.Content>
				<Card.Footer class="w-full gap-4">
					<Button variant="destructive" onclick={leave_room} class="w-full">Leave</Button>
					<Button variant="secondary" class="w-full" onclick={() => set_display_only(false)}
						>Leave Display Mode</Button
					>
				</Card.Footer>
			</Card.Root>
			<div class="col-span-2 flex flex-col gap-4">
				{#if room_pressed}
					<div class="flex h-full w-full shrink-0 flex-col items-center justify-center rounded-2xl">
						<div
							class="flex h-[480px] w-[480px] items-center justify-center rounded-full bg-[green]"
						>
							<span class="text-6xl font-bold">{room_who_pressed!.name}</span>
						</div>
					</div>
				{:else}
					<div
						class="flex h-full w-full shrink-0 animate-pulse flex-col items-center justify-center rounded-2xl"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="480"
							height="480"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide-icon lucide lucide-loader-pinwheel shrink-0 animate-[spin_15s_linear_infinite]"
							><!----><path d="M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5 2.2 5 5 5 5-2.2 5-5"
							></path><!----><path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6"></path><!----><path
								d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6"
							></path><!----><circle cx="12" cy="12" r="10"></circle><!----><!----><!----></svg
						>
						<span>Waiting for button press...</span>

						<div class="absolute top-[80%] grid grid-cols-4 gap-2">
							{#if curr_players}
								{#each curr_players as player}
									{#if !player.display_only}
										<div>{player.name}</div>
									{/if}
								{/each}
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
		<Button variant="destructive" onclick={() => set_display_only(false)} class="w-full"
			>Leave Display Mode</Button
		>
	{/if}
</div>

<AlertDialog.Root bind:open={alert_open}>
	<AlertDialog.Content>
		<Input class="" bind:value={id} />
		<AlertDialog.Footer>
			<Button onclick={() => (alert_open = false)}>Close</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
