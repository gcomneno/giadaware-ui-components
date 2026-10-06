<script lang="ts">
    import {
        ImageAttachmentControl, ImageFocalPointControl, ImageLightbox,
        Button, Surface, FormActions
    } from 'giadaware-ui-components';
    import type {
        ImageAttachmentState, ImageAttachmentControlLabels,
        ImageFocalPointValue, ImageLightboxLabels
    } from 'giadaware-ui-components';

    const sample = {
        src: '/demo/landscape.svg',
        alt: 'Geometric mountains beneath a golden sun',
        name: 'landscape.svg'
    };
    const labels: ImageAttachmentControlLabels = {
        input: 'Choose a local replacement image',
        cancelReplacement: 'Cancel replacement',
        remove: 'Mark image for removal',
        cancelRemoval: 'Cancel removal',
        keepExistingStatus: 'Keeping the sample image.',
        keepEmptyStatus: 'No image selected.',
        replaceStatus: 'Local replacement selected; nothing uploaded.',
        removeStatus: 'Removal intent selected; nothing deleted.',
        replacementPreviewAlt: 'Preview of the selected local replacement'
    };
    const lightboxLabels: ImageLightboxLabels = {
        dialog: 'Local image preview', close: 'Close image preview'
    };

    let attachment = $state<ImageAttachmentState>({ intent: 'keep', file: null });
    let focal = $state<ImageFocalPointValue>({ x: 0.5, y: 0.5 });
    let open = $state(false);
    let replacementSrc = $state<string | null>(null);
    let resetKey = $state(0);

    // Runs only in the browser, and creates a URL only after a user selects a file.
    // Cleanup releases the consumer's URL; the attachment control owns its own preview.
    $effect(() => {
        const file = attachment.intent === 'replace' ? attachment.file : null;
        if (!file) {
            replacementSrc = null;
            return;
        }
        const url = URL.createObjectURL(file);
        replacementSrc = url;
        return () => URL.revokeObjectURL(url);
    });

    const image = $derived({
        src: replacementSrc ?? sample.src,
        alt: attachment.intent === 'replace'
            ? 'Selected local replacement image' : sample.alt
    });
    const filename = $derived(attachment.intent === 'replace' ? attachment.file.name : sample.name);

    function changeAttachment(next: ImageAttachmentState) {
        open = false;
        attachment = next;
        focal = { x: 0.5, y: 0.5 };
    }

    function reset() {
        open = false;
        attachment = { intent: 'keep', file: null };
        focal = { x: 0.5, y: 0.5 };
        resetKey += 1;
    }
</script>

<p>One bundled static image, or one local replacement selected by you. No upload, deletion or persistence occurs.</p>

{#key resetKey}
    <ImageAttachmentControl
        id="demo-attachment"
        value={attachment}
        onvaluechange={changeAttachment}
        currentImage={sample}
        {labels}
        accept="image/*"
        maxSizeBytes={5 * 1024 * 1024}
        invalidTypeMessage="Choose an image file."
        tooLargeMessage="Choose an image smaller than 5 MiB."
    />
{/key}

<p>Choose a focal point with the pointer or arrow keys; Shift + arrow moves further. Coordinates stay local.</p>
<ImageFocalPointControl
    {image}
    value={focal}
    onvaluechange={(next) => focal = next}
    label="Choose the local image focal point"
    disabled={attachment.intent === 'remove'}
/>

<FormActions class="demo-controls">
    <Button onclick={() => open = true} disabled={attachment.intent === 'remove'}>
        Open full image
    </Button>
    <Button variant="secondary" onclick={reset}>Reset image</Button>
</FormActions>

<ImageLightbox
    {open}
    onopenchange={(next) => open = next}
    src={image.src}
    alt={image.alt}
    labels={lightboxLabels}
>
    {#snippet caption()}
        <span>{filename}. Full image preview; focal point does not crop this lightbox.</span>
    {/snippet}
</ImageLightbox>

<Surface class="demo-state">
    <pre>{JSON.stringify({
        intent: attachment.intent,
        filename,
        replacementFilename: attachment.intent === 'replace' ? attachment.file.name : null,
        focalPoint: focal,
        lightboxOpen: open,
        upload: 'none',
        persistence: 'none'
    }, null, 2)}</pre>
</Surface>

<p class="demo-docs">
    Contracts:
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/README.md#imageattachmentcontrol">ImageAttachmentControl</a>,
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/image-focal-point-control.md">ImageFocalPointControl</a>,
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/image-lightbox.md">ImageLightbox</a>.
</p>
