#!/usr/bin/env node

import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, access } from "node:fs/promises";
import { constants } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

interface CommandResult {
    code: number | null;
    signal: NodeJS.Signals | null;
    stdout: string;
    stderr: string;
    combined: string;
    durationMs: number;
}

interface StepDefinition {
    name: string;
    command: string;
    args: string[];
    cwd: string;
    expectedFiles?: string[];
}

interface RoutineOptions {
    projectName: string;
    themeRepo: string;
    themeDir: string;
    themeName: string;
    configFile: string;
    keepOnSuccess: boolean;
    keepOnFailure: boolean;
    runContentSmokeTest: boolean;
    verbose: boolean;
}

interface StepReport {
    step: string;
    commandLine: string;
    cwd: string;
    result: CommandResult;
}

interface HtmlAssertion {
    description: string;
    test: (html: string) => boolean;
}

const DEFAULT_OPTIONS: RoutineOptions = {
    projectName: "quickstart",
    themeRepo: "https://github.com/theNewDynamic/gohugo-theme-ananke.git",
    themeDir: "themes/ananke",
    themeName: "ananke",
    configFile: "hugo.toml",
    keepOnSuccess: false,
    keepOnFailure: true,
    runContentSmokeTest: true,
    verbose: true,
};

/**
 * Print CLI help.
 */
function printHelp(): void {
    console.log(`
Usage:
  node scripts/test-hugo-quickstart.ts [options]

Options:
  --project-name=<name>         Hugo project folder name inside the temp directory
  --theme-repo=<url>            Git URL for the theme submodule
  --theme-dir=<path>            Theme target directory inside the project
  --theme-name=<name>           Theme name written into hugo.toml
  --config-file=<file>          Hugo config file to update
  --keep-on-success             Do not delete the temp directory when the test passes
  --no-keep-on-failure          Delete the temp directory when the test fails
  --no-content-smoke-test       Skip "hugo new foo.md"
  --quiet                       Reduce step logging
  --help                        Show this help

Examples:
  node scripts/test-hugo-quickstart.ts
  node scripts/test-hugo-quickstart.ts --keep-on-success
  node scripts/test-hugo-quickstart.ts --project-name=quickstart-test
`.trim());
}

/**
 * Parse CLI arguments into routine options.
 *
 * @param argv Raw CLI arguments after the executable and script path.
 * @returns Parsed routine options.
 * @throws Error when an unknown argument is passed.
 */
function parseArgs(argv: string[]): RoutineOptions {
    const options: RoutineOptions = { ...DEFAULT_OPTIONS };

    for (const arg of argv) {
        if (arg === "--help") {
            printHelp();
            process.exit(0);
        }

        if (arg === "--keep-on-success") {
            options.keepOnSuccess = true;
            continue;
        }

        if (arg === "--no-keep-on-failure") {
            options.keepOnFailure = false;
            continue;
        }

        if (arg === "--no-content-smoke-test") {
            options.runContentSmokeTest = false;
            continue;
        }

        if (arg === "--quiet") {
            options.verbose = false;
            continue;
        }

        if (arg.startsWith("--project-name=")) {
            options.projectName = arg.slice("--project-name=".length);
            continue;
        }

        if (arg.startsWith("--theme-repo=")) {
            options.themeRepo = arg.slice("--theme-repo=".length);
            continue;
        }

        if (arg.startsWith("--theme-dir=")) {
            options.themeDir = arg.slice("--theme-dir=".length);
            continue;
        }

        if (arg.startsWith("--theme-name=")) {
            options.themeName = arg.slice("--theme-name=".length);
            continue;
        }

        if (arg.startsWith("--config-file=")) {
            options.configFile = arg.slice("--config-file=".length);
            continue;
        }

        throw new Error(`Unknown argument: ${arg}`);
    }

    return options;
}

/**
 * Format a command for human-readable logging.
 *
 * @param command Executable name.
 * @param args Executable arguments.
 * @returns Full command line.
 */
function formatCommand(command: string, args: string[]): string {
    return [command, ...args]
        .map((part) => (/\s/.test(part) ? JSON.stringify(part) : part))
        .join(" ");
}

/**
 * Run a command and capture stdout/stderr.
 *
 * @param command Executable name.
 * @param args Executable arguments.
 * @param cwd Working directory.
 * @returns Command execution result.
 */
async function runCommand(
    command: string,
    args: string[],
    cwd: string,
): Promise<CommandResult> {
    const started = Date.now();

    return new Promise<CommandResult>((resolve, reject) => {
        const child = spawn(command, args, {
            cwd,
            env: process.env,
            stdio: ["ignore", "pipe", "pipe"],
        });

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", (chunk: Buffer | string) => {
            stdout += chunk.toString();
        });

        child.stderr.on("data", (chunk: Buffer | string) => {
            stderr += chunk.toString();
        });

        child.on("error", (error: Error) => {
            reject(error);
        });

        child.on("close", (code, signal) => {
            const durationMs = Date.now() - started;
            const combined = [stdout, stderr].filter(Boolean).join(stdout && stderr ? "\n" : "");

            resolve({
                code,
                signal,
                stdout,
                stderr,
                combined,
                durationMs,
            });
        });
    });
}

/**
 * Ensure a file exists.
 *
 * @param filePath Absolute file path.
 */
async function assertFileExists(filePath: string): Promise<void> {
    await access(filePath, constants.F_OK);
}

/**
 * Execute one quick-start step and validate success.
 *
 * @param step Step definition.
 * @returns Step report.
 * @throws Error when the command fails or an expected file is missing.
 */
async function executeStep(step: StepDefinition): Promise<StepReport> {
    const result = await runCommand(step.command, step.args, step.cwd);
    const commandLine = formatCommand(step.command, step.args);

    if (result.code !== 0) {
        const details = [
            `Step failed: ${step.name}`,
            `Command: ${commandLine}`,
            `Working directory: ${step.cwd}`,
            `Exit code: ${String(result.code)}`,
            result.signal ? `Signal: ${result.signal}` : "",
            result.stdout ? `STDOUT:\n${result.stdout}` : "",
            result.stderr ? `STDERR:\n${result.stderr}` : "",
        ]
            .filter(Boolean)
            .join("\n\n");

        throw new Error(details);
    }

    if (step.expectedFiles) {
        for (const relativePath of step.expectedFiles) {
            const absolutePath = join(step.cwd, relativePath);

            try {
                await assertFileExists(absolutePath);
            } catch (error: unknown) {
                const message =
                    error instanceof Error ? error.message : "Unknown file assertion error";

                throw new Error(
                    [
                        `Step failed: ${step.name}`,
                        `Command: ${commandLine}`,
                        `Working directory: ${step.cwd}`,
                        `Expected file missing: ${absolutePath}`,
                        `Details: ${message}`,
                        result.stdout ? `STDOUT:\n${result.stdout}` : "",
                        result.stderr ? `STDERR:\n${result.stderr}` : "",
                    ]
                        .filter(Boolean)
                        .join("\n\n"),
                );
            }
        }
    }

    return {
        step: step.name,
        commandLine,
        cwd: step.cwd,
        result,
    };
}

/**
 * Escape a string for safe use in a regular expression.
 *
 * @param value Raw string.
 * @returns Escaped string.
 */
function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Read a text file as UTF-8.
 *
 * @param filePath Absolute file path.
 * @returns File contents.
 */
async function readTextFile(filePath: string): Promise<string> {
    return readFile(filePath, "utf8");
}

/**
 * Assert that Hugo config contains the expected theme assignment.
 *
 * @param configPath Absolute config path.
 * @param themeName Expected theme name.
 * @throws Error when the config does not contain the expected theme.
 */
async function assertThemeConfigured(
    configPath: string,
    themeName: string,
): Promise<void> {
    const config = await readTextFile(configPath);
    const themePattern = new RegExp(
        String.raw`^\s*theme\s*=\s*['"]${escapeRegExp(themeName)}['"]\s*$`,
        "m",
    );

    if (!themePattern.test(config)) {
        throw new Error(
            [
                "Strict assertion failed: theme configuration missing or incorrect.",
                `Config file: ${configPath}`,
                `Expected: theme = '${themeName}'`,
                "Actual file contents:",
                config,
            ].join("\n\n"),
        );
    }
}

/**
 * Return the strict homepage assertions.
 *
 * These are intentionally a mix of generic HTML checks and theme-oriented checks.
 * The goal is not to pin every byte of output, but to prove that the theme actually
 * rendered a plausible Ananke homepage.
 *
 * @returns List of homepage assertions.
 */
function getHomepageAssertions(): HtmlAssertion[] {
    return [
        {
            description: "homepage contains an HTML document root",
            test: (html: string): boolean => /<html\b/i.test(html),
        },
        {
            description: "homepage contains a document title",
            test: (html: string): boolean => /<title>[\s\S]*?<\/title>/i.test(html),
        },
        {
            description: "homepage contains a body element",
            test: (html: string): boolean => /<body\b/i.test(html),
        },
        {
            description: "homepage contains at least one stylesheet reference",
            test: (html: string): boolean =>
                /<link\b[^>]*rel=["']stylesheet["'][^>]*>/i.test(html),
        },
        {
            description: "homepage contains at least one navigation-related landmark",
            test: (html: string): boolean =>
                /<(nav|header)\b/i.test(html),
        },
        {
            description: "homepage contains theme-generated CSS class markers",
            test: (html: string): boolean =>
                /\b(ma[0-9]|pa[0-9]|bg-black|near-white|sans-serif)\b/i.test(html),
        },
        {
            description: "homepage contains a main content area",
            test: (html: string): boolean =>
                /<(main|article|section)\b/i.test(html),
        },
    ];
}

/**
 * Assert that the generated homepage looks like a real themed render and not just
 * an empty or broken output file.
 *
 * @param homepagePath Absolute path to `public/index.html`.
 * @throws Error when one or more strict assertions fail.
 */
async function assertHomepageLooksValid(homepagePath: string): Promise<void> {
    const html = await readTextFile(homepagePath);
    const failures: string[] = [];

    if (html.trim().length === 0) {
        throw new Error(
            [
                "Strict assertion failed: generated homepage is empty.",
                `Homepage file: ${homepagePath}`,
            ].join("\n\n"),
        );
    }

    for (const assertion of getHomepageAssertions()) {
        if (!assertion.test(html)) {
            failures.push(`- ${assertion.description}`);
        }
    }

    if (failures.length > 0) {
        throw new Error(
            [
                "Strict assertion failed: generated homepage did not match expected render checks.",
                `Homepage file: ${homepagePath}`,
                "Failed assertions:",
                ...failures,
            ].join("\n"),
        );
    }
}

/**
 * Assert that generated sample content contains frontmatter and basic metadata.
 *
 * @param contentPath Absolute path to the created content file.
 * @throws Error when the content file does not look like a valid Hugo content file.
 */
async function assertGeneratedContentLooksValid(contentPath: string): Promise<void> {
    const content = await readTextFile(contentPath);
    const failures: string[] = [];

    if (!/^---\s*$/m.test(content) && !/^\+\+\+\s*$/m.test(content)) {
        failures.push("- generated content does not appear to contain frontmatter delimiters");
    }

    if (!/^\s*title\s*:/m.test(content) && !/^\s*title\s*=/m.test(content)) {
        failures.push("- generated content does not contain a title field");
    }

    if (!/^\s*date\s*:/m.test(content) && !/^\s*date\s*=/m.test(content)) {
        failures.push("- generated content does not contain a date field");
    }

    if (failures.length > 0) {
        throw new Error(
            [
                "Strict assertion failed: generated content file did not match expected Hugo structure.",
                `Content file: ${contentPath}`,
                "Failed assertions:",
                ...failures,
                "",
                "Actual file contents:",
                content,
            ].join("\n"),
        );
    }
}

/**
 * Run the Hugo quick-start verification routine.
 *
 * @param options Runtime options.
 * @returns Process exit code.
 */
async function runRoutine(options: RoutineOptions): Promise<number> {
    const sandboxRoot = await mkdtemp(join(tmpdir(), "hugo-quickstart-"));
    const projectRoot = join(sandboxRoot, options.projectName);

    const reports: StepReport[] = [];

    const steps: StepDefinition[] = [
        {
            name: "Create Hugo project",
            command: "hugo",
            args: ["new", "project", options.projectName],
            cwd: sandboxRoot,
            expectedFiles: [join(options.projectName, options.configFile)],
        },
        {
            name: "Initialise Git repository",
            command: "git",
            args: ["init"],
            cwd: projectRoot,
            expectedFiles: [".git"],
        },
        {
            name: "Add theme as Git submodule",
            command: "git",
            args: ["submodule", "add", options.themeRepo, options.themeDir],
            cwd: projectRoot,
            expectedFiles: [options.themeDir, ".gitmodules"],
        },
        {
            name: "Configure theme in Hugo config",
            command: "bash",
            args: ["-lc", `printf "\\ntheme = '${options.themeName}'\\n" >> ${JSON.stringify(options.configFile)}`],
            cwd: projectRoot,
            expectedFiles: [options.configFile],
        },
        {
            name: "Build site",
            command: "hugo",
            args: [],
            cwd: projectRoot,
            expectedFiles: ["public/index.html"],
        },
    ];

    if (options.runContentSmokeTest) {
        steps.push({
            name: "Create sample content",
            command: "hugo",
            args: ["new", "foo.md"],
            cwd: projectRoot,
            expectedFiles: ["content/foo.md"],
        });
    }

    try {
        console.log(`Test root: ${sandboxRoot}`);
        console.log(`Project root: ${projectRoot}`);

        for (const step of steps) {
            if (options.verbose) {
                console.log(`\n[RUN] ${step.name}`);
                console.log(`      ${formatCommand(step.command, step.args)}`);
            }

            const report = await executeStep(step);
            reports.push(report);

            if (options.verbose) {
                console.log(
                    `[OK ] ${step.name} (${report.result.durationMs} ms, exit ${String(report.result.code)})`,
                );

                const trimmedOutput = report.result.combined.trim();
                if (trimmedOutput) {
                    console.log(trimmedOutput);
                }
            }
        }

        const configPath = join(projectRoot, options.configFile);
        const homepagePath = join(projectRoot, "public/index.html");

        console.log("\n[RUN] Strict config assertion");
        await assertThemeConfigured(configPath, options.themeName);
        console.log("[OK ] Strict config assertion");

        console.log("\n[RUN] Strict homepage assertion");
        await assertHomepageLooksValid(homepagePath);
        console.log("[OK ] Strict homepage assertion");

        if (options.runContentSmokeTest) {
            const contentPath = join(projectRoot, "content/foo.md");

            console.log("\n[RUN] Strict generated content assertion");
            await assertGeneratedContentLooksValid(contentPath);
            console.log("[OK ] Strict generated content assertion");
        }

        console.log("\nResult: PASS");

        if (options.keepOnSuccess) {
            console.log(`Keeping successful test directory: ${projectRoot}`);
        } else {
            await rm(sandboxRoot, { recursive: true, force: true });
            console.log(`Deleted successful test directory: ${sandboxRoot}`);
        }

        return 0;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";

        console.error("\nResult: FAIL");
        console.error(message);

        if (reports.length > 0) {
            console.error("\nCompleted command steps before failure:");
            for (const report of reports) {
                console.error(`- ${report.step}`);
            }
        }

        if (options.keepOnFailure) {
            console.error(`\nKept failing test directory for inspection: ${projectRoot}`);
        } else {
            await rm(sandboxRoot, { recursive: true, force: true });
            console.error(`\nDeleted failing test directory: ${sandboxRoot}`);
        }

        return 1;
    }
}

/**
 * Main entry point.
 */
async function main(): Promise<void> {
    try {
        const options = parseArgs(process.argv.slice(2));
        const exitCode = await runRoutine(options);
        process.exit(exitCode);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown fatal error";
        console.error(`Fatal error: ${message}`);
        process.exit(1);
    }
}

await main();