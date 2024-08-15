<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
</script>

<Toaster richColors position="top-center" />
<ModeWatcher />
<slot></slot>
