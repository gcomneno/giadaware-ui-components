<script lang="ts">
	import AsyncOperationPanel from '../../src/lib/studio/AsyncOperationPanel.svelte';
	let count = $state(0);
</script>
<div data-testid="async-operation-panel-hydration-probe" data-action-count={count}>
	<AsyncOperationPanel state="idle" title="Idle">{#snippet action()}<button onclick={() => count += 1}>Idle action</button>{/snippet}</AsyncOperationPanel>
	<AsyncOperationPanel state="running" title="Running" busyLabel="Working">{#snippet action()}<button disabled>Running action</button>{/snippet}</AsyncOperationPanel>
	<AsyncOperationPanel state="success" title="Success" message="Done" technicalDetails="collapsed detail" technicalDetailsLabel="Collapsed output">{#snippet action()}<button>Success action</button>{/snippet}</AsyncOperationPanel>
	<AsyncOperationPanel state="warning" title="Warning" message="Review" technicalDetails="expanded detail" technicalDetailsLabel="Expanded output" technicalDetailsInitiallyExpanded>{#snippet action()}<button>Warning action</button>{/snippet}</AsyncOperationPanel>
	<AsyncOperationPanel state="error" title="Error" message="Failed">{#snippet action()}<button>Error action</button>{/snippet}</AsyncOperationPanel>
</div>
