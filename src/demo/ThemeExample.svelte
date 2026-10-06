<script lang="ts">
    import { Surface, Button, FormActions } from 'giadaware-ui-components';

    let roomy = $state(false);
</script>

<p>This isolated Surface overrides only its own padding and radius through public custom properties.</p>

<Surface style={roomy
    ? '--giu-surface-padding: 1.75rem; --giu-surface-border-radius: 1.5rem'
    : '--giu-surface-padding: 0.75rem; --giu-surface-border-radius: 0.25rem'}>
    <p>Local customization: {roomy ? 'roomy and rounded' : 'compact and square'}.</p>
</Surface>

<FormActions class="demo-controls">
    <Button variant="secondary" onclick={() => roomy = !roomy}>Toggle Surface spacing</Button>
    <Button variant="secondary" onclick={() => roomy = false}>Reset customization</Button>
</FormActions>

<p class="demo-docs">
    Contract:
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/surface.md">Surface styling hooks</a>.
</p>
