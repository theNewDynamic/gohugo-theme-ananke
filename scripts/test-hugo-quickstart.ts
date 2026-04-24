#!/usr/bin/env node

import { spawn } from "node:child_process";
import { constants } from "node:fs";
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
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
	themeRepo: "https://github.com/gohugo-ananke/ananke.git",
	themeDir: "themes/ananke",
	themeName: "ananke",
	configFile: "hugo.toml",
	keepOnSuccess: false,
	keepOnFailure: true,
	verbose: true,
};

/**
 * Print CLI help.
 */
function printHelp(): void {
	console.log(
		`
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
  --quiet                       Reduce step logging
  --help                        Show this help
`.trim(),
	);
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
			const combined = [stdout, stderr]
				.filter(Boolean)
				.join(stdout && stderr ? "\n" : "");

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
 * Ensure a file or directory exists.
 *
 * @param filePath Absolute path to check.
 */
async function assertFileExists(filePath: string): Promise<void> {
	await access(filePath, constants.F_OK);
}

/**
 * Ensure a file or directory does not exist.
 *
 * @param filePath Absolute path to check.
 */
async function assertFileDoesNotExist(filePath: string): Promise<void> {
	try {
		await access(filePath, constants.F_OK);
		throw new Error(`Unexpected path exists: ${filePath}`);
	} catch (error: unknown) {
		if (
			error instanceof Error &&
			error.message.startsWith("Unexpected path exists:")
		) {
			throw error;
		}
	}
}

/**
 * Read a UTF-8 text file.
 *
 * @param filePath Absolute file path.
 * @returns File contents.
 */
async function readTextFile(filePath: string): Promise<string> {
	return readFile(filePath, "utf8");
}

/**
 * Write a UTF-8 text file.
 *
 * @param filePath Absolute file path.
 * @param content File contents.
 */
async function writeTextFile(filePath: string, content: string): Promise<void> {
	await writeFile(filePath, content, "utf8");
}

/**
 * Remove the generated public directory inside the temporary project.
 *
 * @param projectRoot Absolute path to the temporary quickstart project.
 */
async function removePublicDir(projectRoot: string): Promise<void> {
	const publicPath = join(projectRoot, "public");
	await rm(publicPath, { recursive: true, force: true });
}

/**
 * Execute one step and validate success.
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
					error instanceof Error
						? error.message
						: "Unknown file assertion error";

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
 * Determine whether a Hugo command generates output in `public/`.
 *
 * @param step Step definition.
 * @returns True when the command is a build command.
 */
function isHugoBuildCommand(step: StepDefinition): boolean {
	if (step.command !== "hugo") {
		return false;
	}

	if (step.args.length === 0) {
		return true;
	}

	if (step.args.includes("--buildDrafts")) {
		return true;
	}

	return false;
}

/**
 * Execute a Hugo build command after clearing the generated public directory.
 *
 * @param step Step definition.
 * @param projectRoot Absolute path to the temporary quickstart project.
 * @returns Step report.
 */
async function executeHugoBuildStep(
	step: StepDefinition,
	projectRoot: string,
): Promise<StepReport> {
	await removePublicDir(projectRoot);
	return executeStep(step);
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
 * Assert that Hugo config contains the expected theme assignment somewhere in
 * the file, without requiring the whole config to match a fixed template.
 *
 * Accepts either single or double quotes, for example:
 * - theme = 'ananke'
 * - theme = "ananke"
 *
 * @param configPath Absolute config path.
 * @param themeName Expected theme name.
 * @throws Error when the config does not contain the expected theme line.
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
				`Expected to find a line like: theme = '${themeName}'`,
				"Actual file contents:",
				config,
			].join("\n\n"),
		);
	}
}

/**
 * Return homepage assertions for the initial static build.
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
			test: (html: string): boolean => /<(nav|header)\b/i.test(html),
		},
		{
			description: "homepage contains theme-generated CSS class markers",
			test: (html: string): boolean =>
				/\b(ma[0-9]|pa[0-9]|bg-black|near-white|sans-serif)\b/i.test(html),
		},
		{
			description: "homepage contains a main content area",
			test: (html: string): boolean => /<(main|article|section)\b/i.test(html),
		},
	];
}

/**
 * Assert that the generated homepage looks like a real themed render.
 *
 * @param homepagePath Absolute path to `public/index.html`.
 * @throws Error when one or more assertions fail.
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
 * Extract the auto-generated date line from a Hugo content file with TOML frontmatter.
 *
 * @param content Raw file contents.
 * @returns Original date line.
 * @throws Error when the date line is missing.
 */
function extractGeneratedDateLine(content: string): string {
	const match = content.match(/^\s*date\s*=\s*.+$/m);

	if (!match) {
		throw new Error(
			[
				"Strict assertion failed: could not find auto-generated date line in content file.",
				"Actual file contents:",
				content,
			].join("\n\n"),
		);
	}

	return match[0];
}

/**
 * Replace the generated content with the requested sample draft while preserving
 * the original date line created by `hugo new`.
 *
 * @param contentPath Absolute path to the content file.
 */
async function replaceGeneratedContent(contentPath: string): Promise<void> {
	const original = await readTextFile(contentPath);
	const dateLine = extractGeneratedDateLine(original);

	const updated = [
		"+++",
		"title = 'My First Post'",
		dateLine,
		"draft = true",
		"+++",
		"## Introduction",
		"",
		"This is **bold** text, and this is *emphasized* text.",
		"",
		"Visit the [Hugo](https://gohugo.io) website!",
		"",
	].join("\n");

	await writeTextFile(contentPath, updated);
}

/**
 * Replace the root Hugo config with the requested quickstart config.
 *
 * @param configPath Absolute path to `hugo.toml`.
 * @param themeName Theme name to set.
 */
async function replaceHugoConfig(
	configPath: string,
	themeName: string,
): Promise<void> {
	const content = [
		"baseURL = 'https://example.com/'",
		"locale = 'en-gb'",
		"title = 'Ananke Test Quickstart'",
		`theme = '${themeName}'`,
		"",
	].join("\n");

	await writeTextFile(configPath, content);
}

/**
 * Assert that the generated page contains the expected rendered draft content.
 *
 * @param pageHtml HTML from `public/foo/index.html`.
 */
function assertDraftPageRendered(pageHtml: string): void {
	const failures: string[] = [];

	if (!/<h2[^>]*>\s*Introduction\s*<\/h2>/i.test(pageHtml)) {
		failures.push("- heading 'Introduction' was not rendered as an h2 element");
	}

	if (!/<strong>\s*bold\s*<\/strong>/i.test(pageHtml)) {
		failures.push("- bold Markdown was not rendered as a <strong> element");
	}

	if (!/<em>\s*emphasized\s*<\/em>/i.test(pageHtml)) {
		failures.push("- emphasized Markdown was not rendered as an <em> element");
	}

	if (
		!/<a[^>]+href=["']https:\/\/gohugo\.io["'][^>]*>\s*Hugo\s*<\/a>/i.test(
			pageHtml,
		)
	) {
		failures.push("- Markdown link was not rendered as an anchor element");
	}

	if (!/My First Post/i.test(pageHtml)) {
		failures.push("- post title was not visible on the rendered page");
	}

	if (failures.length > 0) {
		throw new Error(
			[
				"Strict assertion failed: draft page content was not rendered as expected.",
				"Failed assertions:",
				...failures,
			].join("\n"),
		);
	}
}

/**
 * Assert that the generated homepage reflects updated title and locale configuration.
 *
 * Locale is checked strictly on the `<html>` tag.
 *
 * @param homepageHtml HTML from `public/index.html`.
 */
function assertUpdatedConfigInOutput(homepageHtml: string): void {
	const failures: string[] = [];

	if (!/Ananke Test Quickstart/i.test(homepageHtml)) {
		failures.push(
			"- updated site title was not visible in the generated output",
		);
	}

	if (!/<html[^>]+lang=["']en-gb["'][^>]*>/i.test(homepageHtml)) {
		failures.push(
			"- updated locale 'en-gb' was not present in the <html lang=\"en-gb\"> tag",
		);
	}

	if (failures.length > 0) {
		throw new Error(
			[
				"Strict assertion failed: updated config was not reflected in the generated output.",
				"Failed assertions:",
				...failures,
			].join("\n"),
		);
	}
}

/**
 * Assert that the draft page is not part of the production build.
 *
 * @param projectRoot Project root.
 * @param homepagePath Absolute path to `public/index.html`.
 */
async function assertDraftHiddenInProduction(
	projectRoot: string,
	homepagePath: string,
): Promise<void> {
	const draftOutputPath = join(projectRoot, "public", "foo", "index.html");
	await assertFileDoesNotExist(draftOutputPath);

	const homepageHtml = await readTextFile(homepagePath);

	if (/My First Post/i.test(homepageHtml)) {
		throw new Error(
			[
				"Strict assertion failed: draft post title was visible in the production homepage output.",
				`Homepage file: ${homepagePath}`,
			].join("\n\n"),
		);
	}
}

/**
 * Run the full Hugo quickstart verification routine.
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
			args: [
				"-lc",
				`printf "\\ntheme = '${options.themeName}'\\n" >> ${JSON.stringify(options.configFile)}`,
			],
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

	try {
		console.log(`Test root: ${sandboxRoot}`);
		console.log(`Project root: ${projectRoot}`);

		for (const step of steps) {
			if (options.verbose) {
				console.log(`\n[RUN] ${step.name}`);
				console.log(`      ${formatCommand(step.command, step.args)}`);
			}

			const report = isHugoBuildCommand(step)
				? await executeHugoBuildStep(step, projectRoot)
				: await executeStep(step);

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
		const contentPath = join(projectRoot, "content/foo.md");
		const draftOutputPath = join(projectRoot, "public", "foo", "index.html");

		console.log("\n[RUN] Strict config assertion");
		await assertThemeConfigured(configPath, options.themeName);
		console.log("[OK ] Strict config assertion");

		console.log("\n[RUN] Strict homepage assertion");
		await assertHomepageLooksValid(homepagePath);
		console.log("[OK ] Strict homepage assertion");

		console.log("\n[RUN] Create sample content");
		const createContentStep: StepDefinition = {
			name: "Create sample content",
			command: "hugo",
			args: ["new", "foo.md"],
			cwd: projectRoot,
			expectedFiles: ["content/foo.md"],
		};
		const createContentReport = await executeStep(createContentStep);
		reports.push(createContentReport);

		if (options.verbose) {
			console.log(
				`      ${formatCommand(createContentStep.command, createContentStep.args)}`,
			);
			console.log(
				`[OK ] ${createContentStep.name} (${createContentReport.result.durationMs} ms, exit ${String(createContentReport.result.code)})`,
			);

			const trimmedOutput = createContentReport.result.combined.trim();
			if (trimmedOutput) {
				console.log(trimmedOutput);
			}
		}

		console.log("\n[RUN] Replace generated content with quickstart sample");
		await replaceGeneratedContent(contentPath);
		console.log("[OK ] Replace generated content with quickstart sample");

		console.log("\n[RUN] Build drafts and verify rendered draft content");
		const draftBuildStep: StepDefinition = {
			name: "Build site with drafts",
			command: "hugo",
			args: ["--buildDrafts"],
			cwd: projectRoot,
			expectedFiles: ["public/index.html", "public/foo/index.html"],
		};
		const draftBuildReport = await executeHugoBuildStep(
			draftBuildStep,
			projectRoot,
		);
		reports.push(draftBuildReport);

		if (options.verbose) {
			console.log(
				`      ${formatCommand(draftBuildStep.command, draftBuildStep.args)}`,
			);
			console.log(
				`[OK ] ${draftBuildStep.name} (${draftBuildReport.result.durationMs} ms, exit ${String(draftBuildReport.result.code)})`,
			);

			const trimmedOutput = draftBuildReport.result.combined.trim();
			if (trimmedOutput) {
				console.log(trimmedOutput);
			}
		}

		const draftPageHtml = await readTextFile(draftOutputPath);
		assertDraftPageRendered(draftPageHtml);
		console.log("[OK ] Build drafts and verify rendered draft content");

		console.log("\n[RUN] Replace root hugo.toml with quickstart config");
		await replaceHugoConfig(configPath, options.themeName);
		console.log("[OK ] Replace root hugo.toml with quickstart config");

		console.log("\n[RUN] Build drafts and verify updated title and locale");
		const configBuildStep: StepDefinition = {
			name: "Build site with updated config and drafts",
			command: "hugo",
			args: ["--buildDrafts"],
			cwd: projectRoot,
			expectedFiles: ["public/index.html", "public/foo/index.html"],
		};
		const configBuildReport = await executeHugoBuildStep(
			configBuildStep,
			projectRoot,
		);
		reports.push(configBuildReport);

		if (options.verbose) {
			console.log(
				`      ${formatCommand(configBuildStep.command, configBuildStep.args)}`,
			);
			console.log(
				`[OK ] ${configBuildStep.name} (${configBuildReport.result.durationMs} ms, exit ${String(configBuildReport.result.code)})`,
			);

			const trimmedOutput = configBuildReport.result.combined.trim();
			if (trimmedOutput) {
				console.log(trimmedOutput);
			}
		}

		const updatedHomepageHtml = await readTextFile(homepagePath);
		assertUpdatedConfigInOutput(updatedHomepageHtml);
		console.log("[OK ] Build drafts and verify updated title and locale");

		console.log("\n[RUN] Production build should exclude draft content");
		const productionBuildStep: StepDefinition = {
			name: "Build production site without drafts",
			command: "hugo",
			args: [],
			cwd: projectRoot,
			expectedFiles: ["public/index.html"],
		};
		const productionBuildReport = await executeHugoBuildStep(
			productionBuildStep,
			projectRoot,
		);
		reports.push(productionBuildReport);

		if (options.verbose) {
			console.log(
				`      ${formatCommand(productionBuildStep.command, productionBuildStep.args)}`,
			);
			console.log(
				`[OK ] ${productionBuildStep.name} (${productionBuildReport.result.durationMs} ms, exit ${String(productionBuildReport.result.code)})`,
			);

			const trimmedOutput = productionBuildReport.result.combined.trim();
			if (trimmedOutput) {
				console.log(trimmedOutput);
			}
		}

		await assertDraftHiddenInProduction(projectRoot, homepagePath);
		console.log("[OK ] Production build should exclude draft content");

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
			console.error(
				`\nKept failing test directory for inspection: ${projectRoot}`,
			);
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
		const message =
			error instanceof Error ? error.message : "Unknown fatal error";
		console.error(`Fatal error: ${message}`);
		process.exit(1);
	}
}

await main();
