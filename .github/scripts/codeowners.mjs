import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import fetch from "node-fetch";

// Load environment variables
dotenv.config();

// GitHub API Token (required)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
	console.error("❌ ERROR: GITHUB_TOKEN is not set. Add it to .env.");
	process.exit(1);
}

// Directory to scan (i18n folder)
const TARGET_DIR = process.argv[2] || "i18n";
const SECTION = process.argv[3] || path.basename(TARGET_DIR);
const REPO_ROOT = execSync("git rev-parse --show-toplevel").toString().trim();
const CODEOWNERS_FILE = path.join(REPO_ROOT, ".github", "CODEOWNERS");

// Section markers
const SECTION_START = `# ${SECTION} - automatically created`;
const SECTION_END = `# ${SECTION} - end`;

// Get commit authors for a specific file
const getCommitAuthors = (file) => {
	try {
		return execSync(`git log --format='%ae' -- "${file}" | sort -u`)
			.toString()
			.trim()
			.split("\n")
			.filter((email) => email);
	} catch (error) {
		return [];
	}
};

// Fetch GitHub username from email
const fetchGitHubUsername = async (email) => {
	try {
		const url = `https://api.github.com/search/users?q=${email}+in:email`;
		const response = await fetch(url, {
			headers: { Authorization: `token ${GITHUB_TOKEN}` },
		});
		const data = await response.json();
		if (data.items && data.items.length > 0) {
			return `@${data.items[0].login}`;
		}
		return `@${email.split("@")[0]}`; // Fallback
	} catch (error) {
		console.error(`❌ ERROR fetching GitHub username for ${email}:`, error);
		return `@${email.split("@")[0]}`;
	}
};

// Process files and generate CODEOWNERS entries
const generateCodeowners = async () => {
	const files = execSync(`find ${TARGET_DIR} -type f`)
		.toString()
		.trim()
		.split("\n");
	let codeownersContent = "";

	for (const file of files) {
		const authors = await Promise.all(
			getCommitAuthors(file).map(fetchGitHubUsername),
		);

		if (authors.length > 0) {
			codeownersContent += `/${file} ${authors.join(" ")}\n`;
		}
	}

	if (!fs.existsSync(path.dirname(CODEOWNERS_FILE))) {
		fs.mkdirSync(path.dirname(CODEOWNERS_FILE), { recursive: true });
	}

	let existingContent = fs.existsSync(CODEOWNERS_FILE)
		? fs.readFileSync(CODEOWNERS_FILE, "utf8")
		: "";
	existingContent = existingContent
		.replace(new RegExp(`\n?${SECTION_START}[\\s\\S]*?${SECTION_END}`, "g"), "")
		.trim();

	const updatedContent = `${existingContent}\n\n${SECTION_START}\n${codeownersContent}${SECTION_END}\n`;
	fs.writeFileSync(CODEOWNERS_FILE, updatedContent.trim() + "\n");

	console.log(`✅ CODEOWNERS updated for section: [${SECTION}]`);
};

generateCodeowners();
