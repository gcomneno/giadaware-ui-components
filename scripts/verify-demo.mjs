import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { access, readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import ts from 'typescript';

const root = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(import.meta.url);
const host = '127.0.0.1';
const port = 4179;
const origin = `http://${host}:${port}`;
const packageName = 'giadaware-ui-components';
const sections = [
    ['profile', 'Edit a profile'],
    ['records', 'Browse sample records'],
    ['feedback', 'Present operation feedback'],
    ['checklist', 'Reorder a checklist'],
    ['image', 'Work with one image'],
    ['relationships', 'Explore relationships']
];

let browser;
let server;
let serverClosed;
let serverExited = false;
let serverError;
let serverLog = '';
let interrupted;
let phase = 'setup';
const contexts = new Set();
const diagnostics = [];

function ensureActive() {
    if (interrupted) throw interrupted;
}

async function eventually(label, assertion, timeout = 8000) {
    const deadline = Date.now() + timeout;
    let lastError;
    do {
        ensureActive();
        try {
            return await assertion();
        } catch (error) {
            lastError = error;
        }
        await delay(50);
    } while (Date.now() < deadline);
    throw new Error(`${label}: ${lastError?.message ?? 'timed out'}`, {
        cause: lastError
    });
}

async function step(name, run) {
    phase = name;
    ensureActive();
    await run();
    console.log(`[demo] ${name} passed`);
}

async function filesIn(directory) {
    const files = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        assert(!entry.isSymbolicLink(), `Demo source must not be a symlink: ${path}`);
        if (entry.isDirectory()) files.push(...await filesIn(path));
        else if (entry.isFile()) files.push(path);
    }
    return files.sort();
}

function checkSpecifier(specifier, file, stylesheetOnly = false) {
    const label = `${relative(root, file)}: ${specifier}`;
    assert(!specifier.includes('\\'), `Unsupported import path: ${label}`);

    if (specifier === packageName) {
        assert(!stylesheetOnly, `CSS must use the public stylesheet: ${label}`);
        return;
    }
    if (specifier === `${packageName}/styles.css`) {
        assert(stylesheetOnly, `Stylesheet imports must be side-effect imports: ${label}`);
        return;
    }
    assert(
        !specifier.startsWith(packageName),
        `Only the root package and exact /styles.css export are allowed: ${label}`
    );

    const clean = specifier.split(/[?#]/, 1)[0];
    assert(
        !/(?:^|\/)(?:src|studio|visitor|internal|dist)(?:\/|$)/.test(clean),
        `Implementation import is forbidden: ${label}`
    );
    assert(
        !/^(?:\$lib|@lib|@\/lib)(?:\/|$)/.test(clean),
        `Library source alias is forbidden: ${label}`
    );

    if (clean.startsWith('.') || clean.startsWith('/')) {
        const target = clean.startsWith('/')
            ? resolve(root, `.${clean}`)
            : resolve(dirname(file), clean);
        const local = relative(root, target).split(sep).join('/');
        assert(
            local.startsWith('src/demo/') || local.startsWith('src/routes/'),
            `Local demo imports must stay inside demo/routes: ${label}`
        );
    }
}

async function verifyImports() {
    const files = [
        ...await filesIn(join(root, 'src/demo')),
        ...await filesIn(join(root, 'src/routes'))
    ];
    let rootImports = 0;
    let publicStylesheets = 0;

    function inspect(specifier, file, stylesheetOnly) {
        checkSpecifier(specifier, file, stylesheetOnly);
        if (specifier === packageName) rootImports += 1;
        if (specifier === `${packageName}/styles.css`) publicStylesheets += 1;
    }

    for (const file of files) {
        const extension = extname(file);
        if (!['.svelte', '.ts', '.js', '.mjs', '.cjs', '.css'].includes(extension)) continue;
        const source = await readFile(file, 'utf8');

        if (extension === '.css' || extension === '.svelte') {
            const css = extension === '.css'
                ? source
                : [...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]
                    .map((match) => match[1]).join('\n');
            for (const match of css.matchAll(
                /@import\s+(?:url\(\s*)?["']([^"']+)["']/gi
            )) {
                inspect(match[1], file, true);
            }
            // Unquoted CSS imports cannot silently bypass the discipline check.
            const stripped = css.replace(
                /@import\s+(?:url\(\s*)?["'][^"']+["'][^;]*;/gi, ''
            );
            assert(!/@import\b/i.test(stripped), `Uninspectable CSS import: ${file}`);
        }

        if (extension === '.css') continue;
        const scripts = extension === '.svelte'
            ? [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
                .map((match) => match[1])
            : [source];

        for (const script of scripts) {
            const ast = ts.createSourceFile(
                file, script, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS
            );
            assert.equal(
                ast.parseDiagnostics.length, 0,
                `Cannot inspect imports in ${relative(root, file)}`
            );
            function visit(node) {
                if (
                    (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
                    node.moduleSpecifier
                ) {
                    assert(
                        ts.isStringLiteralLike(node.moduleSpecifier),
                        `Nonliteral module specifier: ${file}`
                    );
                    inspect(
                        node.moduleSpecifier.text,
                        file,
                        ts.isImportDeclaration(node) && !node.importClause
                    );
                }
                if (ts.isImportTypeNode(node)) {
                    assert(
                        ts.isLiteralTypeNode(node.argument) &&
                        ts.isStringLiteralLike(node.argument.literal),
                        `Nonliteral type import: ${file}`
                    );
                    inspect(node.argument.literal.text, file, false);
                }
                if (
                    ts.isCallExpression(node) &&
                    (
                        node.expression.kind === ts.SyntaxKind.ImportKeyword ||
                        (ts.isIdentifier(node.expression) && node.expression.text === 'require')
                    )
                ) {
                    assert(
                        node.arguments.length >= 1 &&
                        ts.isStringLiteralLike(node.arguments[0]),
                        `Computed imports cannot be verified: ${file}`
                    );
                    inspect(node.arguments[0].text, file, false);
                }
                ts.forEachChild(node, visit);
            }
            visit(ast);
        }

        // Also inspect literal dynamic imports in Svelte template expressions.
        if (extension === '.svelte') {
            for (const match of source.matchAll(
                /\b(?:import|require)\s*\(\s*(['"`])([^'"`]+)\1/g
            )) {
                inspect(match[2], file, false);
            }
        }
    }
    assert(rootImports > 0, 'No root package imports found in the demo');
    assert(publicStylesheets > 0, 'No public stylesheet import found in the demo');
}

async function assertPortAvailable() {
    const probe = createServer();
    await new Promise((resolvePromise, reject) => {
        probe.once('error', reject);
        probe.listen({ host, port, exclusive: true }, resolvePromise);
    });
    await new Promise((resolvePromise, reject) => {
        probe.close((error) => error ? reject(error) : resolvePromise());
    });
}

function signalServer(signal) {
    if (!server?.pid) return;
    try {
        // npm and Vite share this process group; killing only npm leaves Vite behind.
        process.kill(-server.pid, signal);
    } catch (error) {
        if (error.code !== 'ESRCH') throw error;
    }
}

function serverGroupAlive() {
    if (!server?.pid) return false;
    try {
        process.kill(-server.pid, 0);
        return true;
    } catch (error) {
        if (error.code === 'ESRCH') return false;
        throw error;
    }
}

async function stopServer() {
    if (!server) return;
    signalServer('SIGTERM');
    const deadline = Date.now() + 3000;
    while (serverGroupAlive() && Date.now() < deadline) await delay(50);
    if (serverGroupAlive()) signalServer('SIGKILL');
    await Promise.race([serverClosed, delay(3000)]);
    assert(serverExited, 'Preview process did not terminate');
    await eventually('Preview port was not released', assertPortAvailable, 3000);
}

function interrupt(reason) {
    interrupted ??= new Error(reason);
    try {
        signalServer('SIGTERM');
    } catch (error) {
        diagnostics.push(`Preview termination: ${error.message}`);
    }
    if (browser) void browser.close().catch(() => {});
}

const onSigint = () => interrupt('Interrupted by SIGINT');
const onSigterm = () => interrupt('Interrupted by SIGTERM');
process.on('SIGINT', onSigint);
process.on('SIGTERM', onSigterm);
const watchdog = setTimeout(
    () => interrupt('Demo verification exceeded its 120-second deadline'),
    120_000
);

async function startServer() {
    assert(
        process.platform !== 'win32',
        'This repository verifier requires POSIX process groups for preview cleanup'
    );
    for (const path of [
        '.svelte-kit/output/server/index.js',
        '.svelte-kit/output/client'
    ]) {
        try {
            await access(join(root, path));
        } catch {
            throw new Error(`Missing built demo (${path}); run npm run build first`);
        }
    }
    await assertPortAvailable().catch((error) => {
        throw new Error(`Preview requires unused loopback port ${port}: ${error.message}`);
    });
    ensureActive();

    server = spawn(
        'npm',
        ['run', 'preview', '--', '--host', host, '--port', String(port), '--strictPort'],
        {
            cwd: root,
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env, NO_COLOR: '1', BROWSER: 'none' }
        }
    );
    serverClosed = new Promise((resolvePromise) => {
        server.once('close', () => {
            serverExited = true;
            resolvePromise();
        });
    });
    server.on('error', (error) => { serverError = error; });
    const capture = (chunk) => {
        serverLog = (serverLog + chunk.toString()).slice(-32_000);
    };
    server.stdout.on('data', capture);
    server.stderr.on('data', capture);

    const deadline = Date.now() + 30_000;
    let lastError;
    while (Date.now() < deadline) {
        ensureActive();
        if (serverError) throw serverError;
        if (serverExited) throw new Error(`Preview exited before readiness:\n${serverLog}`);
        try {
            const response = await fetch(`${origin}/`, {
                redirect: 'manual',
                signal: AbortSignal.timeout(1000)
            });
            await response.body?.cancel();
            if (response.ok) return;
            lastError = new Error(`HTTP ${response.status}`);
        } catch (error) {
            lastError = error;
        }
        await delay(100);
    }
    throw new Error(`Preview did not become ready: ${lastError?.message}\n${serverLog}`);
}

async function newContext(options = {}) {
    ensureActive();
    const context = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        serviceWorkers: 'block',
        ...options
    });
    contexts.add(context);
    await context.route('**/*', async (route) => {
        const url = new URL(route.request().url());
        if (
            url.origin === origin ||
            url.protocol === 'data:' ||
            url.protocol === 'blob:'
        ) {
            await route.continue();
        } else {
            diagnostics.push(`Blocked external request: ${url.href}`);
            await route.abort('blockedbyclient');
        }
    });
    context.on('page', (page) => {
        page.setDefaultTimeout(8000);
        page.setDefaultNavigationTimeout(15_000);
        page.on('pageerror', (error) => {
            diagnostics.push(`Uncaught browser error: ${error.message}`);
        });
        page.on('console', (message) => {
            if (
                message.type() === 'error' ||
                /hydrat|recover/i.test(message.text())
            ) {
                diagnostics.push(`Browser ${message.type()}: ${message.text()}`);
            }
        });
    });
    return context;
}

async function closeContext(context) {
    await context.close();
    contexts.delete(context);
}

async function openPage(context) {
    const page = await context.newPage();
    const response = await page.goto(`${origin}/`, { waitUntil: 'networkidle' });
    assert(response?.ok(), `Demo navigation failed: HTTP ${response?.status()}`);
    return page;
}

async function state(page, id) {
    return JSON.parse(await page.locator(`#${id} .demo-state pre`).first().textContent());
}

async function expectState(page, id, expected) {
    await eventually(`${id} consumer state`, async () => {
        const actual = await state(page, id);
        for (const [key, value] of Object.entries(expected)) {
            assert.deepEqual(actual[key], value, `${id}.${key}`);
        }
    });
}

async function snapshots(page) {
    const result = {};
    for (const [id] of sections) result[id] = await state(page, id);
    return result;
}

async function controls(page) {
    return {
        name: await page.locator('#profile-name').inputValue(),
        biography: await page.locator('#profile-biography').inputValue(),
        role: await page.locator('#profile-role').inputValue(),
        city: await page.locator('#profile-city-input').inputValue(),
        newsletter: await page.locator('#profile-newsletter').isChecked(),
        team: await page.locator('#profile-team').isChecked(),
        theme: await page.locator('#theme-neutral').isChecked(),
        presentation: await page.locator('#feedback-presentation').inputValue(),
        recordsTab: await page.getByRole('tab', { name: 'Records', exact: true })
            .getAttribute('aria-selected')
    };
}

async function focused(locator) {
    await eventually('Keyboard focus', async () => {
        assert(await locator.evaluate((element) => element === document.activeElement));
    });
}

async function audit(page, label) {
    if (!await page.evaluate(() => Boolean(window.axe))) {
        await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    }
    const violations = await page.evaluate(async () => {
        const result = await window.axe.run(document);
        return result.violations
            .filter((violation) => ['serious', 'critical'].includes(violation.impact))
            .map((violation) => ({
                id: violation.id,
                impact: violation.impact,
                description: violation.description,
                nodes: violation.nodes.map((node) => ({
                    target: node.target,
                    failureSummary: node.failureSummary
                }))
            }));
    });
    assert.deepEqual(
        violations, [],
        `${label}: serious/critical axe violations:\n${JSON.stringify(violations, null, 2)}`
    );
}

async function noOverflow(page, label) {
    await page.evaluate(async () => { await document.fonts.ready; });
    const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        html: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        scroller: getComputedStyle(
            document.querySelector('#records .demo-table-scroll')
        ).overflowX
    }));
    assert(
        dimensions.html <= dimensions.viewport + 1 &&
        dimensions.body <= dimensions.viewport + 1,
        `${label}: page-level horizontal overflow: ${JSON.stringify(dimensions)}`
    );
    assert(
        ['auto', 'scroll'].includes(dimensions.scroller),
        'The records table must keep its local horizontal scroller'
    );
}

let failure;
try {
    await step('public import discipline', verifyImports);
    await step('built preview startup', startServer);
    browser = await chromium.launch({ headless: true, timeout: 15_000 });
    ensureActive();

    let ssrStates;
    let ssrControls;
    await step('SSR without JavaScript', async () => {
        const context = await newContext({ javaScriptEnabled: false });
        try {
            const page = await openPage(context);
            await page.getByRole('heading', {
                name: 'Public components, real consumer code', level: 1
            }).waitFor({ state: 'visible' });

            const navigation = page.getByRole('navigation', {
                name: 'Living demo sections'
            });
            await navigation.waitFor({ state: 'visible' });
            assert.equal(await navigation.getByRole('link').count(), 6);

            for (const [id, title] of sections) {
                assert.equal(await page.locator(`#${id}`).count(), 1);
                await page.locator(`#${id}`).getByRole('heading', {
                    name: title, level: 2, exact: true
                }).waitFor({ state: 'visible' });
                assert.equal(
                    await navigation.locator(`a[href="#${id}"]`).count(), 1
                );
                const disclosure = page.locator(`#${id} details`).filter({
                    has: page.locator('summary', { hasText: 'Show actual' })
                });
                assert.equal(await disclosure.count(), 1);
                assert(
                    (await disclosure.locator('code').textContent())
                        .includes("from 'giadaware-ui-components'"),
                    `${id}: actual source is missing from SSR`
                );
            }

            const source = page.locator('#profile details').filter({
                has: page.locator('summary', { hasText: 'Show actual edit a profile source' })
            });
            await source.locator('summary').click();
            await source.locator('pre').waitFor({ state: 'visible' });
            assert((await source.locator('code').textContent()).includes('function submit'));
            await source.locator('summary').click();
            await source.locator('pre').waitFor({ state: 'hidden' });

            ssrStates = await snapshots(page);
            ssrControls = await controls(page);
            assert.deepEqual(ssrControls, {
                name: 'Ada Morgan',
                biography: 'I build accessible interfaces.',
                role: 'developer',
                city: 'Bologna',
                newsletter: false,
                team: true,
                theme: true,
                presentation: 'panel',
                recordsTab: 'true'
            });
            await expectState(page, 'profile', {
                name: 'Ada Morgan', query: 'Bologna', committedCity: 'bologna'
            });
            await expectState(page, 'records', {
                page: 1, tab: 'records', visibleIds: ['r1', 'r2', 'r3'],
                reviewed: [], dialogOpen: false
            });
            await expectState(page, 'feedback', { state: 'idle', progress: 0 });
            await expectState(page, 'checklist', { eventKey: null });
            assert.deepEqual(
                ssrStates.checklist.items.map((item) => item.id),
                ['labels', 'keyboard', 'hydration', 'package']
            );
            await expectState(page, 'image', {
                intent: 'keep', focalPoint: { x: 0.5, y: 0.5 }, lightboxOpen: false
            });
            await expectState(page, 'relationships', { selection: null, activation: null });
            await page.getByText('No submitted snapshot.', { exact: true })
                .waitFor({ state: 'visible' });
        } finally {
            await closeContext(context);
        }
    });

    const context = await newContext();
    const page = await openPage(context);

    await step('hydration and initial accessibility', async () => {
        await page.evaluate(() => new Promise((resolvePromise) => {
            requestAnimationFrame(() => requestAnimationFrame(resolvePromise));
        }));
        assert.deepEqual(await controls(page), ssrControls);
        assert.deepEqual(await snapshots(page), ssrStates);

        // A reversible consumer interaction proves the client handlers are active.
        await page.locator('#theme-dark').check();
        await eventually('Hydrated theme handler', async () => {
            assert.equal(
                await page.locator('.demo-shell').getAttribute('data-giu-theme'), 'dark'
            );
        });
        await page.getByRole('button', { name: 'Reset theme', exact: true }).click();
        await eventually('Theme reset', async () => {
            assert.equal(
                await page.locator('.demo-shell').getAttribute('data-giu-theme'), 'neutral'
            );
        });
        assert.deepEqual(await controls(page), ssrControls);
        assert.deepEqual(await snapshots(page), ssrStates);
        assert.deepEqual(diagnostics, [], diagnostics.join('\n'));
        await audit(page, 'Initial hydrated demo');
    });

    await step('profile edit, keyboard combobox, local submit and reset', async () => {
        const profile = page.locator('#profile');
        const name = page.locator('#profile-name');
        await name.fill('A');
        await profile.getByRole('button', { name: 'Submit locally', exact: true }).click();
        await page.locator('#profile-name-error').waitFor({ state: 'visible' });
        assert.equal(await name.getAttribute('aria-invalid'), 'true');
        await profile.getByText('No submitted snapshot.', { exact: true })
            .waitFor({ state: 'visible' });

        await name.fill('Grace Hopper');
        await page.locator('#profile-biography').fill('A locally edited biography.');
        await page.locator('#profile-role').selectOption('designer');
        await page.locator('#profile-newsletter').check();

        const city = page.locator('#profile-city-input');
        await city.fill('Mil');
        await expectState(page, 'profile', { query: 'Mil', committedCity: 'bologna' });
        await city.press('ArrowDown');
        const option = profile.getByRole('option', { name: 'Milan', exact: true });
        await option.waitFor({ state: 'visible' });
        await city.press('Enter');
        await expectState(page, 'profile', { query: 'Milan', committedCity: 'milan' });
        assert.equal(await city.inputValue(), 'Milan');

        await profile.getByRole('button', { name: 'Submit locally', exact: true }).click();
        await eventually('Local submission snapshot', async () => {
            const snapshots = profile.locator('.demo-state pre');
            assert.equal(await snapshots.count(), 2);
            assert.deepEqual(JSON.parse(await snapshots.nth(1).textContent()), {
                name: 'Grace Hopper',
                biography: 'A locally edited biography.',
                role: 'designer',
                newsletter: true,
                visibility: 'team',
                city: 'milan'
            });
        });
        assert.equal(new URL(page.url()).pathname, '/');

        await profile.getByRole('button', { name: 'Reset profile', exact: true }).click();
        await eventually('Profile reset', async () => {
            assert.deepEqual(await state(page, 'profile'), ssrStates.profile);
            assert.equal(await profile.locator('.demo-state pre').count(), 1);
            assert.equal(await city.inputValue(), 'Bologna');
            assert.equal(await name.inputValue(), 'Ada Morgan');
        });
    });

    await step('records tabs, pagination, keyboard menu, tooltip and dialog', async () => {
        const records = page.locator('#records');
        const recordsTab = records.getByRole('tab', { name: 'Records', exact: true });
        const summaryTab = records.getByRole('tab', {
            name: 'Review summary', exact: true
        });
        await recordsTab.focus();
        await recordsTab.press('ArrowRight');
        await focused(summaryTab);
        await summaryTab.press('Enter');
        await expectState(page, 'records', { tab: 'summary' });
        assert.equal(await summaryTab.getAttribute('aria-selected'), 'true');
        await records.getByText('0 of 7 sample records reviewed locally.', {
            exact: true
        }).waitFor({ state: 'visible' });
        await audit(page, 'Alternate record tab');

        await summaryTab.press('ArrowLeft');
        await focused(recordsTab);
        await recordsTab.press('Enter');
        await expectState(page, 'records', { tab: 'records' });

        await records.getByRole('button', { name: 'Next', exact: true }).click();
        await expectState(page, 'records', {
            page: 2, visibleIds: ['r4', 'r5', 'r6']
        });
        await records.getByRole('rowheader', { name: 'Delta', exact: true })
            .waitFor({ state: 'visible' });

        const menuTrigger = records.getByRole('button', {
            name: 'Actions for Delta', exact: true
        });
        await menuTrigger.focus();
        await menuTrigger.press('ArrowDown');
        const inspectItem = records.getByRole('menuitem', {
            name: 'Inspect record', exact: true
        });
        await inspectItem.waitFor({ state: 'visible' });
        await focused(inspectItem);
        await audit(page, 'Open record action menu');
        await inspectItem.press('Escape');
        await inspectItem.waitFor({ state: 'hidden' });
        await focused(menuTrigger);

        await menuTrigger.press('ArrowDown');
        await inspectItem.press('ArrowDown');
        const reviewItem = records.getByRole('menuitem', {
            name: 'Mark reviewed', exact: true
        });
        await focused(reviewItem);
        await reviewItem.press('Enter');
        await expectState(page, 'records', {
            reviewed: ['r4'], lastAction: 'Delta marked reviewed locally.'
        });
        await reviewItem.waitFor({ state: 'hidden' });
        await focused(menuTrigger);
        const deltaRowHeader = records.getByRole('rowheader', {
            name: 'Delta',
            exact: true
        });
        const deltaRow = deltaRowHeader.locator('..');

        await eventually('Delta review cell', async () => {
            const cells = deltaRow.getByRole('cell');
            assert.equal(await cells.count(), 3);
            assert.equal(
                (await cells.nth(1).textContent()).trim(),
                'Reviewed'
            );
        });

        const inspectButton = records.getByRole('button', {
            name: 'Inspect Delta', exact: true
        });
        await inspectButton.focus();
        const tooltip = records.getByRole('tooltip');
        await tooltip.waitFor({ state: 'visible' });
        assert((await tooltip.textContent()).includes('local detail dialog'));
        await inspectButton.press('Escape');
        await tooltip.waitFor({ state: 'hidden' });

        await inspectButton.press('Enter');
        const dialog = page.getByRole('dialog', { name: 'Delta', exact: true });
        await dialog.waitFor({ state: 'visible' });
        await expectState(page, 'records', { dialogOpen: true, selectedId: 'r4' });
        await dialog.getByText('A record awaiting local review.', { exact: true })
            .waitFor({ state: 'visible' });
        assert(await dialog.evaluate((element) => element.contains(document.activeElement)));
        await audit(page, 'Open record detail dialog');
        await page.keyboard.press('Escape');
        await dialog.waitFor({ state: 'hidden' });
        await expectState(page, 'records', { dialogOpen: false });
        await focused(inspectButton);

        await inspectButton.press('Enter');
        await dialog.waitFor({ state: 'visible' });
        await dialog.getByRole('button', { name: 'Close details', exact: true }).click();
        await dialog.waitFor({ state: 'hidden' });
        await focused(inspectButton);

        await records.getByRole('button', { name: 'Reset records', exact: true }).click();
        await eventually('Records reset', async () => {
            assert.deepEqual(await state(page, 'records'), ssrStates.records);
        });
    });

    await step('feedback lifecycle', async () => {
        const feedback = page.locator('#feedback');
        await feedback.getByRole('button', {
            name: 'Start local scenario', exact: true
        }).click();
        await expectState(page, 'feedback', { state: 'running', progress: 0 });
        await feedback.getByRole('button', {
            name: 'Advance progress by 25%', exact: true
        }).click();
        await expectState(page, 'feedback', { state: 'running', progress: 25 });
        assert.equal(
            await feedback.getByRole('progressbar', {
                name: 'Sample operation progress'
            }).getAttribute('value'),
            '25'
        );
        await feedback.getByRole('button', {
            name: 'Complete successfully', exact: true
        }).click();
        await expectState(page, 'feedback', { state: 'success', progress: 100 });
        await feedback.getByRole('status').getByText(
            'Sample operation completed locally.', { exact: true }
        ).waitFor({ state: 'visible' });
        await feedback.getByRole('button', { name: 'Reset feedback', exact: true }).click();
        await eventually('Feedback reset', async () => {
            assert.deepEqual(await state(page, 'feedback'), ssrStates.feedback);
        });
    });

    await step('keyed checklist reorder', async () => {
        const checklist = page.locator('#checklist');
        const original = await page.locator('#checklist-labels').elementHandle();
        assert(original, 'Missing initial keyed checklist checkbox');
        try {
            await checklist.getByRole('button', {
                name: 'Move Try keyboard interactions up', exact: true
            }).click();
            await eventually('Visible reordered checklist', async () => {
                assert.deepEqual(await checklist.locator('label').allTextContents(), [
                    'Try keyboard interactions',
                    'Check native labels',
                    'Review hydration behavior',
                    'Verify packed consumption'
                ]);
                const current = await state(page, 'checklist');
                assert.deepEqual(
                    current.items.map((item) => item.id),
                    ['keyboard', 'labels', 'hydration', 'package']
                );
                assert.equal(current.items[1].done, true);
                assert.equal(current.eventKey, 1);
                assert(await original.evaluate((element) => (
                    element.isConnected &&
                    element === document.getElementById('checklist-labels') &&
                    element.checked
                )), 'Keyed reorder replaced or lost the original checkbox state');
            });
            await checklist.getByRole('status').getByText(
                'Try keyboard interactions moved to position 1 of 4.', { exact: true }
            ).waitFor({ state: 'visible' });
        } finally {
            await original.dispose();
        }
        await checklist.getByRole('button', { name: 'Reset checklist', exact: true }).click();
        await eventually('Checklist reset', async () => {
            assert.deepEqual(await state(page, 'checklist'), ssrStates.checklist);
        });
    });

    await step('image focal point and lightbox', async () => {
        const image = page.locator('#image');
        const focal = image.getByRole('button', {
            name: 'Choose the local image focal point', exact: true
        });
        await focal.focus();
        await focal.press('ArrowRight');
        await eventually('Consumer focal point update', async () => {
            const current = await state(page, 'image');
            assert(current.focalPoint.x > 0.5 && current.focalPoint.x <= 1);
            assert.equal(current.focalPoint.y, 0.5);
        });
        const trigger = image.getByRole('button', { name: 'Open full image', exact: true });
        await trigger.focus();
        await trigger.press('Enter');
        const lightbox = page.getByRole('dialog', {
            name: 'Local image preview', exact: true
        });
        await lightbox.waitFor({ state: 'visible' });
        await expectState(page, 'image', { lightboxOpen: true });
        await lightbox.getByRole('img', {
            name: 'Geometric mountains beneath a golden sun', exact: true
        }).waitFor({ state: 'visible' });
        await lightbox.getByRole('button', {
            name: 'Close image preview', exact: true
        }).click();
        await lightbox.waitFor({ state: 'hidden' });
        await expectState(page, 'image', { lightboxOpen: false });
        await focused(trigger);
        await image.getByRole('button', { name: 'Reset image', exact: true }).click();
        await eventually('Image reset', async () => {
            assert.deepEqual(await state(page, 'image'), ssrStates.image);
        });
    });

    await step('consumer-owned relationship summary', async () => {
        const graph = page.locator('#relationships');
        await graph.getByRole('button', { name: 'Design', exact: true }).click();
        await expectState(page, 'relationships', {
            selection: 'design',
            activation: { id: 'design', source: 'pointer' }
        });
        await graph.getByText('Selected node: design.', { exact: true })
            .waitFor({ state: 'visible' });
        const engineering = graph.getByRole('button', {
            name: 'Engineering', exact: true
        });
        await engineering.focus();
        await engineering.press('Enter');
        await expectState(page, 'relationships', {
            selection: 'engineering',
            activation: { id: 'engineering', source: 'keyboard' }
        });
        await graph.getByText('Last activation: engineering by keyboard.', {
            exact: true
        }).waitFor({ state: 'visible' });
        assert.equal(new URL(page.url()).pathname, '/');
        await graph.getByRole('button', {
            name: 'Reset relationships', exact: true
        }).click();
        await expectState(page, 'relationships', { selection: null, activation: null });
    });

    await step('narrow viewport containment', async () => {
        const narrowContext = await newContext({
            viewport: { width: 390, height: 844 }
        });
        try {
            const narrow = await openPage(narrowContext);
            await noOverflow(narrow, 'Initial narrow demo');
            const source = narrow.locator('#profile details').filter({
                has: narrow.locator('summary', {
                    hasText: 'Show actual edit a profile source'
                })
            });
            await source.locator('summary').click();
            await source.locator('pre').waitFor({ state: 'visible' });
            await noOverflow(narrow, 'Narrow demo with revealed source');
            await source.locator('summary').click();
        } finally {
            await closeContext(narrowContext);
        }
    });

    await step('browser diagnostics', async () => {
        assert.deepEqual(diagnostics, [], diagnostics.join('\n'));
        ensureActive();
    });
} catch (error) {
    failure = error;
} finally {
    clearTimeout(watchdog);
    const cleanupErrors = [];
    for (const context of contexts) {
        try {
            await context.close();
        } catch (error) {
            cleanupErrors.push(error);
        }
    }
    contexts.clear();
    if (browser) {
        try {
            await browser.close();
        } catch (error) {
            cleanupErrors.push(error);
        }
    }
    try {
        await stopServer();
    } catch (error) {
        cleanupErrors.push(error);
    }
    process.off('SIGINT', onSigint);
    process.off('SIGTERM', onSigterm);
    if (cleanupErrors.length) {
        failure = new AggregateError(
            failure ? [failure, ...cleanupErrors] : cleanupErrors,
            'Demo verification or resource cleanup failed'
        );
    }
}

if (failure) {
    console.error(`Demo verification failed during ${phase}:`);
    console.error(failure);
    if (diagnostics.length) console.error(diagnostics.join('\n'));
    if (serverLog) console.error(`Preview output:\n${serverLog}`);
    process.exitCode = 1;
} else {
    console.log('Built consumer demo verification passed; preview and browser resources closed.');
}
