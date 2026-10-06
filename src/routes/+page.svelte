<script lang="ts">
    import {
        PageIntro, Panel, Surface, Disclosure, NavList, Radio, Button,
        FormActions, SocialLink, SocialIcon
    } from 'giadaware-ui-components';
    import ThemeExample from '../demo/ThemeExample.svelte';
    import themeSource from '../demo/ThemeExample.svelte?raw';
    import cssSource from '../demo/demo.css?raw';
    import ProfileExample from '../demo/ProfileExample.svelte';
    import ProfileExampleSource from '../demo/ProfileExample.svelte?raw';
    import RecordsExample from '../demo/RecordsExample.svelte';
    import RecordsExampleSource from '../demo/RecordsExample.svelte?raw';
    import FeedbackExample from '../demo/FeedbackExample.svelte';
    import FeedbackExampleSource from '../demo/FeedbackExample.svelte?raw';
    import ChecklistExample from '../demo/ChecklistExample.svelte';
    import ChecklistExampleSource from '../demo/ChecklistExample.svelte?raw';
    import ImageExample from '../demo/ImageExample.svelte';
    import ImageExampleSource from '../demo/ImageExample.svelte?raw';
    import RelationshipsExample from '../demo/RelationshipsExample.svelte';
    import RelationshipsExampleSource from '../demo/RelationshipsExample.svelte?raw';

    let theme = $state('neutral');
    const navigation = [
        { href: '#profile', label: 'Edit a profile' },
        { href: '#records', label: 'Browse sample records' },
        { href: '#feedback', label: 'Present operation feedback' },
        { href: '#checklist', label: 'Reorder a checklist' },
        { href: '#image', label: 'Work with one image' },
        { href: '#relationships', label: 'Explore relationships' }
    ];
</script>

<svelte:head>
    <title>GiadaWare UI · living consumer demo</title>
    <meta name="description" content="Six local Svelte consumer examples with visible state, actual source and public component contracts." />
</svelte:head>

<div class="demo-shell" data-giu-theme={theme}>
    <a class="demo-skip-link" href="#demo-main">Skip to examples</a>
    <header class="demo-header">
        <p class="demo-eyebrow">GiadaWare UI · programmer-facing living demo</p>
        <h1>Public components, real consumer code</h1>
        <PageIntro>
            Six practical examples using <code>giadaware-ui-components</code>.
            State, filtering and workflow stay in ordinary Svelte consumer code.
            All interactions are local to this page.
        </PageIntro>
        <p>
            This repository's Vite configuration maps exactly the package root and public stylesheet
            to source for development. Packed consumption is independently checked by
            <code>verify:pack</code>.
        </p>
        <p><a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/interface-guide.md">Read the authoritative interface guide</a></p>

        <fieldset class="demo-fieldset demo-theme-choice">
            <legend>Demo theme</legend>
            <div class="demo-choice">
                <Radio id="theme-neutral" name="demo-theme" value="neutral" bind:group={theme} />
                <label for="theme-neutral">Neutral</label>
                <Radio id="theme-dark" name="demo-theme" value="dark" bind:group={theme} />
                <label for="theme-dark">Dark</label>
            </div>
        </fieldset>
        <p>Theme: <code>{theme}</code>. Consumer CSS in <code>src/demo/demo.css</code> maps public <code>--giu-theme-*</code> tokens to component hooks. Preset variables do not automatically recolor every component.</p>
        <Button variant="secondary" onclick={() => theme = 'neutral'}>Reset theme</Button>
        <Disclosure>
            {#snippet summary()}Try an isolated custom-property example{/snippet}
            <ThemeExample />
            <Disclosure>
                {#snippet summary()}Show actual customization source{/snippet}
                <Surface class="demo-source"><pre><code>{themeSource}</code></pre></Surface>
            </Disclosure>
        </Disclosure>
        <Disclosure>
            {#snippet summary()}Show the actual consumer CSS mappings{/snippet}
            <Surface class="demo-source"><pre><code>{cssSource}</code></pre></Surface>
        </Disclosure>
    </header>

    <div class="demo-layout">
        <aside class="demo-navigation">
            <NavList aria-label="Living demo sections" items={navigation} />
            <p>Anchors within one page. No link claims to be the current page.</p>
        </aside>

        <main id="demo-main" class="demo-main" tabindex="-1">
            <Panel id="profile" title="Edit a profile">
                <ProfileExample />
                <Disclosure>
                    {#snippet summary()}Show actual edit a profile source{/snippet}
                    <Surface class="demo-source"><pre><code>{ProfileExampleSource}</code></pre></Surface>
                </Disclosure>
            </Panel>

            <Panel id="records" title="Browse sample records">
                <RecordsExample />
                <Disclosure>
                    {#snippet summary()}Show actual browse sample records source{/snippet}
                    <Surface class="demo-source"><pre><code>{RecordsExampleSource}</code></pre></Surface>
                </Disclosure>
            </Panel>

            <Panel id="feedback" title="Present operation feedback">
                <FeedbackExample />
                <Disclosure>
                    {#snippet summary()}Show actual present operation feedback source{/snippet}
                    <Surface class="demo-source"><pre><code>{FeedbackExampleSource}</code></pre></Surface>
                </Disclosure>
            </Panel>

            <Panel id="checklist" title="Reorder a checklist">
                <ChecklistExample />
                <Disclosure>
                    {#snippet summary()}Show actual reorder a checklist source{/snippet}
                    <Surface class="demo-source"><pre><code>{ChecklistExampleSource}</code></pre></Surface>
                </Disclosure>
            </Panel>

            <Panel id="image" title="Work with one image">
                <ImageExample />
                <Disclosure>
                    {#snippet summary()}Show actual work with one image source{/snippet}
                    <Surface class="demo-source"><pre><code>{ImageExampleSource}</code></pre></Surface>
                </Disclosure>
            </Panel>

            <Panel id="relationships" title="Explore relationships">
                <RelationshipsExample />
                <Disclosure>
                    {#snippet summary()}Show actual explore relationships source{/snippet}
                    <Surface class="demo-source"><pre><code>{RelationshipsExampleSource}</code></pre></Surface>
                </Disclosure>
            </Panel>

            <Panel id="resources" title="Resources">
                <p>Public contracts define the library boundary; these examples own their local application behavior.</p>
                <FormActions>
                    <SocialLink id="github" href="https://github.com/gcomneno/giadaware-ui-components">
                        Repository on GitHub
                    </SocialLink>
                    <a class="demo-resource-link" href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/interface-guide.md">
                        <SocialIcon id="github" size={20} />
                        Interface guide on GitHub
                    </a>
                </FormActions>
                <p class="demo-docs">
                    Composition contracts:
                    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/page-intro.md">PageIntro</a>,
                    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/panel.md">Panel</a>,
                    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/surface.md">Surface</a>,
                    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/component-surface-expansion.md">Disclosure and NavList</a>,
                    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/social-link.md">SocialLink</a>,
                    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/README.md#socialicon">SocialIcon</a>.
                </p>
            </Panel>
        </main>
    </div>
</div>
