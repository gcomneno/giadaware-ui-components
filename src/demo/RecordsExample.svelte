<script lang="ts">
    import {
        Table, TableCaption, TableHead, TableBody, TableRow, TableHeaderCell, TableCell,
        Tabs, TabList, Tab, TabPanel, MenuButton, MenuItem, MenuSeparator,
        Pagination, Dialog, Accordion, AccordionItem, Tooltip, IconButton,
        Button, Surface, FormActions
    } from 'giadaware-ui-components';
    import type { PaginationLabels } from 'giadaware-ui-components';

    type RecordItem = { id: string; name: string; category: string; note: string };
    const records: readonly RecordItem[] = [
        { id: 'r1', name: 'Atlas', category: 'Reference', note: 'A sample reference collection.' },
        { id: 'r2', name: 'Birch', category: 'Draft', note: 'An early sample draft.' },
        { id: 'r3', name: 'Cedar', category: 'Reference', note: 'A second reference record.' },
        { id: 'r4', name: 'Delta', category: 'Review', note: 'A record awaiting local review.' },
        { id: 'r5', name: 'Elm', category: 'Draft', note: 'A short sample record.' },
        { id: 'r6', name: 'Fern', category: 'Review', note: 'A final sample for pagination.' },
        { id: 'r7', name: 'Grove', category: 'Reference', note: 'The last page has one record.' }
    ];
    const pageSize = 3;
    const pageCount = Math.ceil(records.length / pageSize);
    const labels: PaginationLabels = {
        navigation: 'Sample record pages', previous: 'Previous', next: 'Next',
        page: (number) => `Page ${number}`
    };

    let page = $state(1);
    let tab = $state('records');
    let selected = $state<RecordItem | null>(null);
    let dialogOpen = $state(false);
    let reviewed = $state<string[]>([]);
    let message = $state('No action chosen.');
    let ownershipOpen = $state(false);
    let keyboardOpen = $state(false);
    let resetKey = $state(0);

    // The library renders controls; this consumer slices its own array.
    const visibleRecords = $derived(records.slice((page - 1) * pageSize, page * pageSize));

    function inspect(record: RecordItem) {
        selected = record;
        dialogOpen = true;
        message = `Inspecting ${record.name}.`;
    }

    function review(record: RecordItem) {
        if (!reviewed.includes(record.id)) reviewed = [...reviewed, record.id];
        message = `${record.name} marked reviewed locally.`;
    }

    function reset() {
        page = 1;
        tab = 'records';
        selected = null;
        dialogOpen = false;
        reviewed = [];
        message = 'No action chosen.';
        ownershipOpen = false;
        keyboardOpen = false;
        resetKey += 1;
    }
</script>

<p>Seven deterministic records, three per page. Pagination, review state and dialog decisions are local consumer code.</p>

<Tabs id="record-tabs" value={tab} onvaluechange={(next) => tab = next}>
    <TabList aria-label="Sample record views">
        <Tab value="records">Records</Tab>
        <Tab value="summary">Review summary</Tab>
    </TabList>

    <TabPanel value="records">
        <div class="demo-table-scroll">
            <Table>
                <TableCaption>Sample records · page {page} of {pageCount}</TableCaption>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell scope="col">Record</TableHeaderCell>
                        <TableHeaderCell scope="col">Category</TableHeaderCell>
                        <TableHeaderCell scope="col">Review</TableHeaderCell>
                        <TableHeaderCell scope="col">Actions</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {#each visibleRecords as record (record.id)}
                        <TableRow>
                            <TableHeaderCell scope="row">{record.name}</TableHeaderCell>
                            <TableCell>{record.category}</TableCell>
                            <TableCell>{reviewed.includes(record.id) ? 'Reviewed' : 'Not reviewed'}</TableCell>
                            <TableCell>
                                <div class="demo-row-actions">
                                    {#key resetKey}
                                        <MenuButton id={`record-menu-${record.id}`}>
                                            {#snippet trigger()}Actions for {record.name}{/snippet}
                                            <MenuItem onclick={() => inspect(record)}>Inspect record</MenuItem>
                                            <MenuSeparator />
                                            <MenuItem disabled={reviewed.includes(record.id)} onclick={() => review(record)}>
                                                Mark reviewed
                                            </MenuItem>
                                        </MenuButton>
                                    {/key}
                                    <Tooltip id={`record-tooltip-${record.id}`}>
                                        {#snippet trigger(props)}
                                            <IconButton
                                                {...props}
                                                label={`Inspect ${record.name}`}
                                                variant="secondary"
                                                onclick={() => inspect(record)}
                                            >
                                                {#snippet icon()}<span>↗</span>{/snippet}
                                            </IconButton>
                                        {/snippet}
                                        Open this record in a local detail dialog.
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    {/each}
                </TableBody>
            </Table>
        </div>
        <Pagination {page} {pageCount} {labels} onpagechange={(next) => page = next} />
    </TabPanel>

    <TabPanel value="summary">
        <p>{reviewed.length} of {records.length} sample records reviewed locally.</p>
        <ul>
            {#each records.filter((record) => reviewed.includes(record.id)) as record (record.id)}
                <li>{record.name}</li>
            {:else}
                <li>No records reviewed yet. Use a record's action menu.</li>
            {/each}
        </ul>
    </TabPanel>
</Tabs>

<Dialog open={dialogOpen} onopenchange={(next) => dialogOpen = next} aria-labelledby="record-dialog-title">
    <h3 id="record-dialog-title">{selected ? selected.name : 'Record details'}</h3>
    <p>{selected?.note ?? 'Choose a record to inspect.'}</p>
    <FormActions>
        <Button onclick={() => {
            if (selected) review(selected);
            dialogOpen = false;
        }} disabled={!selected}>Mark reviewed and close</Button>
        <Button variant="secondary" onclick={() => dialogOpen = false}>Close details</Button>
    </FormActions>
</Dialog>

<Accordion id="records-notes">
    <AccordionItem bind:open={ownershipOpen}>
        {#snippet summary()}Who owns the data behavior?{/snippet}
        <p>This example owns array slicing and review state. Table does not sort, fetch or navigate.</p>
    </AccordionItem>
    <AccordionItem bind:open={keyboardOpen}>
        {#snippet summary()}Keyboard paths{/snippet}
        <p>Use arrow keys in tabs and action menus. Focus the inspect icon to read its tooltip. Escape closes the controlled dialog.</p>
    </AccordionItem>
</Accordion>

<Button variant="secondary" onclick={reset}>Reset records</Button>

<Surface class="demo-state">
    <pre>{JSON.stringify({
        page, pageSize, visibleIds: visibleRecords.map((record) => record.id),
        tab, reviewed, dialogOpen, selectedId: selected?.id ?? null,
        ownershipOpen, keyboardOpen, lastAction: message
    }, null, 2)}</pre>
</Surface>

<p class="demo-docs">
    Contracts:
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/component-surface-expansion.md">Table, Tabs, MenuButton, Pagination, Dialog, Accordion and Tooltip</a>,
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/icon-button.md">IconButton</a>.
</p>
