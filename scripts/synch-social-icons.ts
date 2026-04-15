#!/usr/bin/env node

/**
 * Check and optionally sync local SVG icons with matching files from simple-icons.
 *
 * Default behaviour:
 * - scans `assets/ananke/socials/`
 * - only checks `.svg` files that already exist locally
 * - compares them with:
 *   https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/
 * - dry-run is the default
 * - use `--apply` to overwrite changed files
 * - use `--delete` to remove local files that do not exist upstream
 * - use `--all` to sync against all upstream SVG files in the icons directory
 *
 * Requirements:
 * - Node.js 22+
 *
 * Examples:
 * - node src/scripts/update-social-icons.ts
 * - node src/scripts/update-social-icons.ts --only-changed
 * - node src/scripts/update-social-icons.ts --apply
 * - node src/scripts/update-social-icons.ts --apply --delete
 * - node src/scripts/update-social-icons.ts --all
 * - node src/scripts/update-social-icons.ts --all --apply
 * - node src/scripts/update-social-icons.ts --all --apply --delete
 * - node src/scripts/update-social-icons.ts --json
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

type CliOptions = {
    dir: string;
    branch: string;
    apply: boolean;
    deleteMissing: boolean;
    onlyChanged: boolean;
    json: boolean;
    verbose: boolean;
    all: boolean;
    concurrency: number;
    help: boolean;
};

type FileResultStatus =
    | 'same'
    | 'changed'
    | 'missing'
    | 'would-create'
    | 'created'
    | 'would-delete'
    | 'deleted'
    | 'updated'
    | 'error';

type FileResult = {
    fileName: string;
    localPath: string;
    remoteUrl: string;
    status: FileResultStatus;
    message: string;
};

type Summary = {
    same: number;
    changed: number;
    missing: number;
    wouldCreate: number;
    created: number;
    wouldDelete: number;
    deleted: number;
    updated: number;
    errors: number;
};

type JsonOutput = {
    options: {
        dir: string;
        branch: string;
        apply: boolean;
        deleteMissing: boolean;
        onlyChanged: boolean;
        json: boolean;
        verbose: boolean;
        all: boolean;
        concurrency: number;
    };
    results: FileResult[];
    summary: Summary;
};

type ProcessingTask =
    | {
        kind: 'upstream';
        fileName: string;
    }
    | {
        kind: 'local-only';
        fileName: string;
    };

const DEFAULT_DIRECTORY = 'assets/ananke/socials';
const DEFAULT_BRANCH = 'develop';
const SIMPLE_ICONS_OWNER = 'simple-icons';
const SIMPLE_ICONS_REPO = 'simple-icons';
const SIMPLE_ICONS_RAW_BASE =
    'https://raw.githubusercontent.com/simple-icons/simple-icons';

const EXIT_SUCCESS = 0;
const EXIT_FAILURE = 1;

/**
 * Print CLI help.
 */
function printHelp(): void {
    const scriptName = path.basename(process.argv[1] ?? 'update-social-icons.ts');

    console.log(`
Usage:
  ${scriptName} [options]

Options:
  --dir <path>         Directory containing local SVG icons
                       Default: ${DEFAULT_DIRECTORY}

  --branch <name>      Branch of simple-icons to read from
                       Default: ${DEFAULT_BRANCH}

  --apply              Replace changed local files with upstream versions
                       Default: disabled

  --delete             Delete local files that do not exist upstream
                       In dry-run mode this only reports "would delete"

  --all                Sync against all upstream SVG icons in the repo folder
                       This creates missing local files and can delete extra
                       local files when combined with --delete

  --only-changed       Show only changed, updated, missing, would-create,
                       created, would-delete, deleted, and error results

  --json               Print JSON output instead of human-readable text

  --verbose            Print additional information

  --concurrency <n>    Number of files to process in parallel
                       Default: 8

  --help               Show this help

Behaviour:
  - Dry-run is the default.
  - Without --all, only existing local .svg files are checked.
  - With --all, all upstream .svg files in simple-icons/icons/ are checked.
  - Each file is matched by filename against:
    ${SIMPLE_ICONS_RAW_BASE}/<branch>/icons/<filename>

Output states:
  * same          local file matches upstream
  * changed       upstream file differs from local file
  * missing       no matching upstream file found
  * would-create  upstream file missing locally and would be created
  * created       upstream file missing locally and was created
  * would-delete  local file missing upstream and would be deleted
  * deleted       local file missing upstream and was deleted
  * updated       local file was replaced because --apply was used
  * error         processing failed
`.trim());
}

/**
 * Parse CLI arguments into a typed options object.
 *
 * @param argv Process arguments excluding node/script prefix.
 * @returns Parsed CLI options.
 */
function parseArgs(argv: string[]): CliOptions {
    const options: CliOptions = {
        dir: DEFAULT_DIRECTORY,
        branch: DEFAULT_BRANCH,
        apply: false,
        deleteMissing: false,
        onlyChanged: false,
        json: false,
        verbose: false,
        all: false,
        concurrency: 8,
        help: false,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];

        if (arg === '--help') {
            options.help = true;
            continue;
        }

        if (arg === '--apply') {
            options.apply = true;
            continue;
        }

        if (arg === '--delete') {
            options.deleteMissing = true;
            continue;
        }

        if (arg === '--only-changed') {
            options.onlyChanged = true;
            continue;
        }

        if (arg === '--json') {
            options.json = true;
            continue;
        }

        if (arg === '--verbose') {
            options.verbose = true;
            continue;
        }

        if (arg === '--all') {
            options.all = true;
            continue;
        }

        if (arg === '--dir') {
            const value = argv[index + 1];
            if (!value) {
                throw new Error('Missing value for --dir');
            }
            options.dir = value;
            index += 1;
            continue;
        }

        if (arg.startsWith('--dir=')) {
            options.dir = arg.slice('--dir='.length);
            continue;
        }

        if (arg === '--branch') {
            const value = argv[index + 1];
            if (!value) {
                throw new Error('Missing value for --branch');
            }
            options.branch = value;
            index += 1;
            continue;
        }

        if (arg.startsWith('--branch=')) {
            options.branch = arg.slice('--branch='.length);
            continue;
        }

        if (arg === '--concurrency') {
            const value = argv[index + 1];
            if (!value) {
                throw new Error('Missing value for --concurrency');
            }

            const parsed = Number.parseInt(value, 10);
            if (!Number.isInteger(parsed) || parsed < 1) {
                throw new Error('--concurrency must be a positive integer');
            }

            options.concurrency = parsed;
            index += 1;
            continue;
        }

        if (arg.startsWith('--concurrency=')) {
            const value = arg.slice('--concurrency='.length);
            const parsed = Number.parseInt(value, 10);
            if (!Number.isInteger(parsed) || parsed < 1) {
                throw new Error('--concurrency must be a positive integer');
            }

            options.concurrency = parsed;
            continue;
        }

        throw new Error(`Unknown argument: ${arg}`);
    }

    return options;
}

/**
 * Build the upstream raw URL for a given icon filename.
 *
 * @param branch Branch name in simple-icons.
 * @param fileName SVG filename.
 * @returns Raw GitHub URL.
 */
function buildRemoteUrl(branch: string, fileName: string): string {
    return `${SIMPLE_ICONS_RAW_BASE}/${encodeURIComponent(branch)}/icons/${encodeURIComponent(fileName)}`;
}

/**
 * Read SVG filenames from the local target directory.
 *
 * @param directory Directory to scan.
 * @returns Sorted list of SVG filenames.
 */
async function getLocalSvgFiles(directory: string): Promise<string[]> {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    return entries
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((fileName) => fileName.toLowerCase().endsWith('.svg'))
        .sort((left, right) => left.localeCompare(right));
}

/**
 * Read upstream SVG filenames from the GitHub contents API.
 *
 * @param branch Branch name in simple-icons.
 * @returns Sorted list of upstream SVG filenames.
 */
async function getUpstreamSvgFiles(branch: string): Promise<string[]> {
    const apiUrl = new URL(
        `https://api.github.com/repos/${encodeURIComponent(SIMPLE_ICONS_OWNER)}/${encodeURIComponent(SIMPLE_ICONS_REPO)}/contents/icons`,
    );
    apiUrl.searchParams.set('ref', branch);

    const response = await fetch(apiUrl.toString(), {
        method: 'GET',
        headers: {
            Accept: 'application/vnd.github+json',
            'User-Agent': 'davidsneighbour-social-icon-updater',
        },
    });

    if (!response.ok) {
        throw new Error(
            `Failed to retrieve upstream icon listing with HTTP ${response.status}`,
        );
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
        throw new Error('Unexpected response while retrieving upstream icon listing');
    }

    const fileNames = data
        .flatMap((entry: unknown) => {
            if (
                typeof entry === 'object' &&
                entry !== null &&
                'type' in entry &&
                'name' in entry &&
                entry.type === 'file' &&
                typeof entry.name === 'string' &&
                entry.name.toLowerCase().endsWith('.svg')
            ) {
                return [entry.name];
            }

            return [];
        })
        .sort((left, right) => left.localeCompare(right));

    return fileNames;
}

/**
 * Fetch the upstream SVG file content.
 *
 * Returns null when the upstream file does not exist.
 *
 * @param remoteUrl Raw GitHub URL.
 * @returns SVG content or null if not found.
 */
async function fetchRemoteSvg(remoteUrl: string): Promise<string | null> {
    const response = await fetch(remoteUrl, {
        method: 'GET',
        headers: {
            Accept: 'image/svg+xml,text/plain;q=0.9,*/*;q=0.8',
            'User-Agent': 'davidsneighbour-social-icon-updater',
        },
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(`Request failed with HTTP ${response.status} for ${remoteUrl}`);
    }

    return await response.text();
}

/**
 * Process one upstream-backed file.
 *
 * - If the upstream file is missing locally:
 *   - dry-run => would-create
 *   - apply   => created
 * - If the local file exists and differs:
 *   - dry-run => changed
 *   - apply   => updated
 * - If the local file exists and matches:
 *   - same
 *
 * @param directory Local directory.
 * @param fileName File name to process.
 * @param branch Upstream branch.
 * @param apply Whether changed or missing local files should be written.
 * @returns Processing result.
 */
async function processUpstreamFile(
    directory: string,
    fileName: string,
    branch: string,
    apply: boolean,
): Promise<FileResult> {
    const localPath = path.join(directory, fileName);
    const remoteUrl = buildRemoteUrl(branch, fileName);

    try {
        const remoteContent = await fetchRemoteSvg(remoteUrl);

        if (remoteContent === null) {
            return {
                fileName,
                localPath,
                remoteUrl,
                status: 'missing',
                message: 'No matching upstream file found',
            };
        }

        const localStats = await fs.stat(localPath).catch(() => null);

        if (!localStats) {
            if (!apply) {
                return {
                    fileName,
                    localPath,
                    remoteUrl,
                    status: 'would-create',
                    message: 'Upstream file exists and would be created locally',
                };
            }

            await fs.writeFile(localPath, remoteContent, 'utf8');

            return {
                fileName,
                localPath,
                remoteUrl,
                status: 'created',
                message: 'Upstream file existed and was created locally',
            };
        }

        const localContent = await fs.readFile(localPath, 'utf8');

        if (localContent === remoteContent) {
            return {
                fileName,
                localPath,
                remoteUrl,
                status: 'same',
                message: 'Local file matches upstream',
            };
        }

        if (!apply) {
            return {
                fileName,
                localPath,
                remoteUrl,
                status: 'changed',
                message: 'Upstream file differs from local file',
            };
        }

        await fs.writeFile(localPath, remoteContent, 'utf8');

        return {
            fileName,
            localPath,
            remoteUrl,
            status: 'updated',
            message: 'Local file replaced with upstream version',
        };
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : 'Unknown error while processing file';

        return {
            fileName,
            localPath,
            remoteUrl,
            status: 'error',
            message,
        };
    }
}

/**
 * Process one local-only file for delete handling.
 *
 * @param directory Local directory.
 * @param fileName File name to process.
 * @param branch Upstream branch.
 * @param apply Whether deletions should be applied.
 * @param deleteMissing Whether missing upstream files should be deleted locally.
 * @returns Processing result.
 */
async function processLocalOnlyFile(
    directory: string,
    fileName: string,
    branch: string,
    apply: boolean,
    deleteMissing: boolean,
): Promise<FileResult> {
    const localPath = path.join(directory, fileName);
    const remoteUrl = buildRemoteUrl(branch, fileName);

    try {
        if (!deleteMissing) {
            return {
                fileName,
                localPath,
                remoteUrl,
                status: 'missing',
                message: 'No matching upstream file found',
            };
        }

        if (!apply) {
            return {
                fileName,
                localPath,
                remoteUrl,
                status: 'would-delete',
                message: 'No matching upstream file found; local file would be deleted',
            };
        }

        await fs.unlink(localPath);

        return {
            fileName,
            localPath,
            remoteUrl,
            status: 'deleted',
            message: 'No matching upstream file found; local file deleted',
        };
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : 'Unknown error while processing file';

        return {
            fileName,
            localPath,
            remoteUrl,
            status: 'error',
            message,
        };
    }
}

/**
 * Determine whether a result should be printed in text mode.
 *
 * @param status Result status.
 * @param onlyChanged Whether same results should be hidden.
 * @returns True if the result should be shown.
 */
function shouldPrintResult(
    status: FileResultStatus,
    onlyChanged: boolean,
): boolean {
    if (!onlyChanged) {
        return true;
    }

    return status !== 'same';
}

/**
 * Print a single result line.
 *
 * @param result File result.
 * @param verbose Whether to include detail lines.
 */
function printResult(result: FileResult, verbose: boolean): void {
    const prefixByStatus: Record<FileResultStatus, string> = {
        same: 'SAME',
        changed: 'CHANGED',
        missing: 'MISS',
        'would-create': 'WOULD-CREATE',
        created: 'CREATED',
        'would-delete': 'WOULD-DELETE',
        deleted: 'DELETED',
        updated: 'UPDATED',
        error: 'ERR',
    };

    console.log(`${prefixByStatus[result.status]} ${result.fileName} - ${result.message}`);

    if (verbose) {
        console.log(`  local:  ${result.localPath}`);
        console.log(`  remote: ${result.remoteUrl}`);
    }
}

/**
 * Build a summary object.
 *
 * @param results All results.
 * @returns Summary counts.
 */
function buildSummary(results: FileResult[]): Summary {
    return {
        same: results.filter((entry) => entry.status === 'same').length,
        changed: results.filter((entry) => entry.status === 'changed').length,
        missing: results.filter((entry) => entry.status === 'missing').length,
        wouldCreate: results.filter((entry) => entry.status === 'would-create').length,
        created: results.filter((entry) => entry.status === 'created').length,
        wouldDelete: results.filter((entry) => entry.status === 'would-delete').length,
        deleted: results.filter((entry) => entry.status === 'deleted').length,
        updated: results.filter((entry) => entry.status === 'updated').length,
        errors: results.filter((entry) => entry.status === 'error').length,
    };
}

/**
 * Print a summary section.
 *
 * @param summary Summary counts.
 */
function printSummary(summary: Summary): void {
    console.log('');
    console.log('Summary');
    console.log(`  same:          ${summary.same}`);
    console.log(`  changed:       ${summary.changed}`);
    console.log(`  updated:       ${summary.updated}`);
    console.log(`  missing:       ${summary.missing}`);
    console.log(`  would-create:  ${summary.wouldCreate}`);
    console.log(`  created:       ${summary.created}`);
    console.log(`  would-delete:  ${summary.wouldDelete}`);
    console.log(`  deleted:       ${summary.deleted}`);
    console.log(`  errors:        ${summary.errors}`);
}

/**
 * Render a one-line progress indicator.
 *
 * @param processed Number of processed tasks.
 * @param total Total number of tasks.
 * @param active Number of currently active tasks.
 */
function renderProgress(
    processed: number,
    total: number,
    active: number,
): void {
    process.stdout.write(`\rProcessing ${processed}/${total} (active: ${active})`);
}

/**
 * Clear the progress line from the terminal.
 */
function clearProgressLine(): void {
    process.stdout.write('\r\x1b[K');
}

/**
 * Run tasks with a bounded concurrency limit.
 *
 * @param params Runner parameters.
 * @returns Results in task order.
 */
async function runTasksWithConcurrency<TInput, TResult>(params: {
    items: TInput[];
    concurrency: number;
    worker: (item: TInput) => Promise<TResult>;
    onResult?: (
        result: TResult,
        processed: number,
        total: number,
        active: number,
    ) => void;
}): Promise<TResult[]> {
    const { items, concurrency, worker, onResult } = params;

    const results = new Array<TResult>(items.length);
    let nextIndex = 0;
    let processed = 0;
    let active = 0;

    async function runWorker(): Promise<void> {
        while (true) {
            const currentIndex = nextIndex;
            if (currentIndex >= items.length) {
                return;
            }

            nextIndex += 1;
            active += 1;

            try {
                const result = await worker(items[currentIndex]);
                results[currentIndex] = result;
            } finally {
                active -= 1;
                processed += 1;

                const result = results[currentIndex];
                if (result !== undefined && onResult) {
                    onResult(result, processed, items.length, active);
                }
            }
        }
    }

    const workerCount = Math.min(concurrency, items.length);
    await Promise.all(
        Array.from({ length: workerCount }, async () => {
            await runWorker();
        }),
    );

    return results;
}

/**
 * Main program entry point.
 */
async function main(): Promise<void> {
    const options = parseArgs(process.argv.slice(2));

    if (options.help) {
        printHelp();
        process.exit(EXIT_SUCCESS);
    }

    const targetDirectory = path.resolve(options.dir);

    const stats = await fs.stat(targetDirectory).catch(() => null);
    if (!stats || !stats.isDirectory()) {
        throw new Error(`Directory does not exist or is not a directory: ${targetDirectory}`);
    }

    const localFiles = await getLocalSvgFiles(targetDirectory);

    let upstreamFiles: string[] = [];
    if (options.all) {
        upstreamFiles = await getUpstreamSvgFiles(options.branch);
    }

    const emptySummary: Summary = {
        same: 0,
        changed: 0,
        missing: 0,
        wouldCreate: 0,
        created: 0,
        wouldDelete: 0,
        deleted: 0,
        updated: 0,
        errors: 0,
    };

    const tasks: ProcessingTask[] = [];

    if (options.all) {
        const upstreamSet = new Set(upstreamFiles);

        for (const fileName of upstreamFiles) {
            tasks.push({
                kind: 'upstream',
                fileName,
            });
        }

        for (const fileName of localFiles) {
            if (!upstreamSet.has(fileName)) {
                tasks.push({
                    kind: 'local-only',
                    fileName,
                });
            }
        }
    } else {
        if (localFiles.length === 0) {
            if (options.json) {
                const emptyOutput: JsonOutput = {
                    options: {
                        dir: targetDirectory,
                        branch: options.branch,
                        apply: options.apply,
                        deleteMissing: options.deleteMissing,
                        onlyChanged: options.onlyChanged,
                        json: options.json,
                        verbose: options.verbose,
                        all: options.all,
                        concurrency: options.concurrency,
                    },
                    results: [],
                    summary: emptySummary,
                };
                console.log(JSON.stringify(emptyOutput, null, 2));
            } else {
                console.log(`No .svg files found in ${targetDirectory}`);
            }

            process.exit(EXIT_SUCCESS);
        }

        for (const fileName of localFiles) {
            tasks.push({
                kind: 'upstream',
                fileName,
            });
        }
    }

    if (!options.json) {
        if (options.all) {
            console.log(
                `Syncing against all upstream SVG file(s) from simple-icons/icons/ into ${targetDirectory}`,
            );
            console.log(`Found ${upstreamFiles.length} upstream SVG file(s).`);
            console.log(`Found ${localFiles.length} local SVG file(s).`);
        } else {
            console.log(`Checking ${localFiles.length} local SVG file(s) in ${targetDirectory}`);
        }

        console.log(`Using simple-icons branch: ${options.branch}`);
        console.log(`Concurrency: ${options.concurrency}`);
        console.log(
            options.apply
                ? 'Apply mode enabled. Changed files will be written.'
                : 'Dry run mode enabled. No files will be written.',
        );

        if (options.deleteMissing) {
            console.log(
                options.apply
                    ? 'Delete mode enabled. Local files missing upstream will be deleted.'
                    : 'Delete mode enabled. Local files missing upstream will be reported as would-delete.',
            );
        }

        if (options.onlyChanged) {
            console.log('Only changed results will be shown.');
        }

        console.log('');
    }

    const results = await runTasksWithConcurrency<ProcessingTask, FileResult>({
        items: tasks,
        concurrency: options.concurrency,
        worker: async (task): Promise<FileResult> => {
            if (task.kind === 'upstream') {
                const result = await processUpstreamFile(
                    targetDirectory,
                    task.fileName,
                    options.branch,
                    options.apply,
                );

                if (result.status === 'missing' && !options.all) {
                    return await processLocalOnlyFile(
                        targetDirectory,
                        task.fileName,
                        options.branch,
                        options.apply,
                        options.deleteMissing,
                    );
                }

                return result;
            }

            return await processLocalOnlyFile(
                targetDirectory,
                task.fileName,
                options.branch,
                options.apply,
                options.deleteMissing,
            );
        },
        onResult: (result, processed, total, active): void => {
            if (!options.json) {
                renderProgress(processed, total, active);

                if (shouldPrintResult(result.status, options.onlyChanged)) {
                    clearProgressLine();
                    printResult(result, options.verbose);
                    renderProgress(processed, total, active);
                }
            }
        },
    });

    if (!options.json) {
        clearProgressLine();
    }

    const summary = buildSummary(results);

    if (options.json) {
        const output: JsonOutput = {
            options: {
                dir: targetDirectory,
                branch: options.branch,
                apply: options.apply,
                deleteMissing: options.deleteMissing,
                onlyChanged: options.onlyChanged,
                json: options.json,
                verbose: options.verbose,
                all: options.all,
                concurrency: options.concurrency,
            },
            results: options.onlyChanged
                ? results.filter((result) => shouldPrintResult(result.status, true))
                : results,
            summary,
        };

        console.log(JSON.stringify(output, null, 2));
    } else {
        printSummary(summary);
    }

    const hasErrors = results.some((entry) => entry.status === 'error');
    process.exit(hasErrors ? EXIT_FAILURE : EXIT_SUCCESS);
}

main().catch((error: unknown) => {
    const message =
        error instanceof Error ? error.message : 'Unknown fatal error';
    console.error(`Fatal error: ${message}`);
    process.exit(EXIT_FAILURE);
});