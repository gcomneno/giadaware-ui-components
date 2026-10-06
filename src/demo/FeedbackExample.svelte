<script lang="ts">
    import {
        AsyncOperationPanel, FormStatus, StatusNotice, Button, Select, FormActions, Surface
    } from 'giadaware-ui-components';
    import type { AsyncOperationState, AsyncOperationProgress, FormStatusTone } from 'giadaware-ui-components';

    type OperationView =
        | { state: 'idle' }
        | { state: 'running'; busyLabel: string; progress: AsyncOperationProgress }
        | { state: 'success' | 'warning' | 'error'; message: string };

    let operationState = $state<AsyncOperationState>('idle');
    let progress = $state(0);
    let presentation = $state('panel');

    const busyLabel = 'Sample operation in progress.';
    const message = $derived(
        operationState === 'success' ? 'Sample operation completed locally.' :
        operationState === 'warning' ? 'Sample operation completed with a review needed.' :
        operationState === 'error' ? 'Sample operation failed. No real work was attempted.' :
        operationState === 'running' ? busyLabel : ''
    );
    const tone = $derived<FormStatusTone>(
        operationState === 'success' || operationState === 'warning' || operationState === 'error' ? operationState : 'info'
    );
    const operation = $derived<OperationView>(
        operationState === 'idle' ? { state: 'idle' } :
        operationState === 'running' ? {
            state: 'running', busyLabel,
            progress: { mode: 'determinate', label: 'Sample operation progress', value: progress, max: 100 }
        } : { state: operationState, message }
    );

    function start() {
        operationState = 'running';
        progress = 0;
    }

    function reset() {
        operationState = 'idle';
        progress = 0;
        presentation = 'panel';
    }
</script>

<p>Advance the scenario with explicit controls. There are no timers, requests or automatic operations.</p>
<div class="demo-field">
    <label for="feedback-presentation">Feedback presentation</label>
    <Select id="feedback-presentation" bind:value={presentation}>
        <option value="panel">AsyncOperationPanel</option>
        <option value="form">FormStatus</option>
        <option value="notice">StatusNotice (static)</option>
    </Select>
</div>
<p>Only the selected presentation is mounted. Panel and FormStatus own their announcement; StatusNotice remains static.</p>

{#snippet operationAction()}
    <Button disabled={operationState === 'running'} onclick={start}>Start local scenario</Button>
{/snippet}

{#if presentation === 'panel'}
    <AsyncOperationPanel
        {...operation}
        title="Sample operation"
        headingLevel={3}
        action={operationAction}
    />
{:else if presentation === 'form'}
    <FormStatus {message} {tone} />
{:else}
    <StatusNotice title={message || 'Ready for a sample operation.'} {tone}>
        <p>This static notice does not request a live announcement.</p>
    </StatusNotice>
{/if}

<FormActions class="demo-controls">
    {#if presentation !== 'panel'}
        <Button disabled={operationState === 'running'} onclick={start}>Start local scenario</Button>
    {/if}
    <Button variant="secondary" disabled={operationState !== 'running' || progress >= 100}
        onclick={() => progress = Math.min(100, progress + 25)}>Advance progress by 25%</Button>
    <Button variant="secondary" disabled={operationState !== 'running'}
        onclick={() => { progress = 100; operationState = 'success'; }}>Complete successfully</Button>
    <Button variant="secondary" disabled={operationState !== 'running'}
        onclick={() => operationState = 'warning'}>Complete with warning</Button>
    <Button variant="danger" disabled={operationState !== 'running'}
        onclick={() => operationState = 'error'}>Simulate error</Button>
    <Button variant="secondary" onclick={reset}>Reset feedback</Button>
</FormActions>

<Surface class="demo-state">
    <pre>{JSON.stringify({ presentation, state: operationState, progress, message }, null, 2)}</pre>
</Surface>

<p class="demo-docs">
    Contracts:
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/async-operation-panel.md">AsyncOperationPanel</a>,
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/README.md#formstatus">FormStatus</a>,
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/status-notice.md">StatusNotice</a>.
</p>
