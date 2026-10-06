<script lang="ts">
    import {
        TextInput, Textarea, Select, Combobox, Checkbox, Radio,
        FieldLabel, FieldDescription, FieldError, Button, FormActions, Surface
    } from 'giadaware-ui-components';
    import type { ComboboxOption } from 'giadaware-ui-components';

    type Profile = {
        name: string;
        biography: string;
        role: string;
        newsletter: boolean;
        visibility: string;
    };

    const initial = (): Profile => ({
        name: 'Ada Morgan',
        biography: 'I build accessible interfaces.',
        role: 'developer',
        newsletter: false,
        visibility: 'team'
    });
    const cities: readonly ComboboxOption[] = [
        { value: 'bologna', label: 'Bologna' },
        { value: 'milan', label: 'Milan' },
        { value: 'rome', label: 'Rome' },
        { value: 'turin', label: 'Turin' }
    ];

    let profile = $state<Profile>(initial());
    let query = $state('Bologna');
    let city = $state<string | null>('bologna');
    let attempted = $state(false);
    let submitted = $state<string | null>(null);
    let resetKey = $state(0);

    // Filtering and committed-value policy belong to this consumer.
    const options = $derived(cities.filter((option) =>
        option.label.toLowerCase().includes(query.trim().toLowerCase())
    ));
    const nameError = $derived(attempted && profile.name.trim().length < 3
        ? 'Use at least three characters for your display name.' : '');

    function commitCity(value: string) {
        city = value;
        query = cities.find((option) => option.value === value)?.label ?? query;
    }

    function submit(event: SubmitEvent) {
        event.preventDefault();
        attempted = true;
        if (profile.name.trim().length < 3) {
            submitted = null;
            return;
        }
        submitted = JSON.stringify({ ...profile, city }, null, 2);
    }

    function reset(event: Event) {
        // This is a fully controlled consumer reset. Prevent the native form
        // reset default action from overwriting the remounted controlled fields.
        event.preventDefault();

        profile = initial();
        query = 'Bologna';
        city = 'bologna';
        attempted = false;
        submitted = null;
        resetKey += 1;
    }
</script>

<p>Edit a local draft. Submit copies it into a local snapshot; nothing is sent or persisted.</p>

<form class="demo-stack" onsubmit={submit} onreset={reset} novalidate>
    <div class="demo-field">
        <label for="profile-name">
            <FieldLabel label="Display name" required requiredLabel="Required" />
        </label>
        <TextInput
            id="profile-name" name="displayName" bind:value={profile.name} required
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? 'profile-name-help profile-name-error' : 'profile-name-help'}
        />
        <FieldDescription id="profile-name-help" text="Use at least three characters. Try a short name and submit to see a static error." />
        <FieldError id="profile-name-error" text={nameError} />
    </div>

    <div class="demo-field">
        <label for="profile-biography"><FieldLabel label="Biography" optional optionalLabel="Optional" /></label>
        <Textarea id="profile-biography" name="biography" rows={3} bind:value={profile.biography} />
    </div>

    <div class="demo-field">
        <label for="profile-role"><FieldLabel label="Role" /></label>
        <Select id="profile-role" name="role" bind:value={profile.role}>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="reviewer">Reviewer</option>
        </Select>
    </div>

    <div class="demo-field">
        <label for="profile-city-input"><FieldLabel label="City" /></label>
        {#key resetKey}
            <Combobox
                id="profile-city" {query} value={city} {options}
                onquerychange={(next) => query = next}
                onvaluechange={commitCity}
                aria-describedby="profile-city-help"
            />
        {/key}
        <FieldDescription id="profile-city-help" text="Type to filter locally. Arrow keys navigate; Enter commits. Typing preserves the committed city." />
        <p>Query: <code>{JSON.stringify(query)}</code> · Committed value: <code>{city ?? 'none'}</code></p>
    </div>

    <div class="demo-choice">
        <Checkbox id="profile-newsletter" name="newsletter" bind:checked={profile.newsletter} />
        <label for="profile-newsletter">Receive the sample newsletter</label>
    </div>

    <fieldset class="demo-fieldset">
        <legend>Profile visibility</legend>
        <div class="demo-choice">
            <Radio id="profile-team" name="profile-visibility" value="team" bind:group={profile.visibility} />
            <label for="profile-team">Team only</label>
        </div>
        <div class="demo-choice">
            <Radio id="profile-public" name="profile-visibility" value="public" bind:group={profile.visibility} />
            <label for="profile-public">Public</label>
        </div>
    </fieldset>

    <FormActions>
        <Button type="submit">Submit locally</Button>
        <Button type="reset" variant="secondary">Reset profile</Button>
    </FormActions>
</form>

<Surface class="demo-state">
    <p><strong>Current draft</strong></p>
    <pre>{JSON.stringify({ ...profile, query, committedCity: city }, null, 2)}</pre>
    <p><strong>Last successful local submission</strong></p>
    {#if submitted}<pre>{submitted}</pre>{:else}<p>No submitted snapshot.</p>{/if}
</Surface>

<p class="demo-docs">
    Contracts:
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/component-surface-expansion.md">Fields and Combobox</a>,
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/field-label.md">FieldLabel</a>,
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/field-description-error.md">Description and error</a>,
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/checkbox.md">Checkbox</a>,
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/radio.md">Radio</a>,
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/button.md">Button</a>,
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/form-actions.md">FormActions</a>.
</p>
