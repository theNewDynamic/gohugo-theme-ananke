import { readFile, writeFile, access, mkdir } from 'node:fs/promises';
import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { homedir } from 'node:os';

const userHomeDir = homedir();

// Load .env files
const GLOBAL_ENV_PATH = path.join(userHomeDir, '.env');
const LOCAL_ENV_PATH = path.resolve('.env');

/**
 * Load environment variables from a file if it exists.
 * @param {string} filePath
 * @returns {object} Parsed environment variables
 */
function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    return dotenv.parse(fs.readFileSync(filePath));
  }
  return {};
}

// Merge global and local .env configurations
const globalEnv = loadEnvFile(GLOBAL_ENV_PATH);
const localEnv = loadEnvFile(LOCAL_ENV_PATH);
process.env = { ...globalEnv, ...process.env, ...localEnv };

// Configurable values
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || '';
const GITHUB_DEV_TOKEN = process.env.GITHUB_DEV_TOKEN || '';
const GITHUB_REPO = process.env.GITHUB_REPO || 'theNewDynamic/gohugo-theme-ananke';
const DEFAULT_MESSAGE_TEMPLATE = 'New release: {{tag_name}} - {{html_url}}';
const MESSAGE_TEMPLATE = process.env.MESSAGE_TEMPLATE || DEFAULT_MESSAGE_TEMPLATE;
const CACHE_DIR = './cache';
const CACHE_FILE = 'github-releases.json';
const CACHE_FILE_PATH = path.join(CACHE_DIR, CACHE_FILE);

/**
 * Ensures the cache directory exists, creating it if necessary.
 * @returns {Promise<void>}
 */
async function ensureCacheDirectory() {
  try {
    await access(CACHE_DIR);
  } catch {
    try {
      await mkdir(CACHE_DIR, { recursive: true });
    } catch (err) {
      console.error(`Failed to create cache directory: ${err.message}`);
      process.exit(1);
    }
  }
}

/**
 * Reads the cache file or returns an empty array if not found.
 * @returns {Promise<string[]>}
 */
async function readCache() {
  try {
    const data = await readFile(CACHE_FILE_PATH, 'utf8');
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

/**
 * Writes data to the cache file.
 * @param {string[]} data
 */
async function writeCache(data) {
  await writeFile(CACHE_FILE_PATH, JSON.stringify(data, null, 2));
}

/**
 * Fetches the latest release from the GitHub REST API.
 * @returns {Promise<{ tag_name: string, html_url: string } | null>}
 */
async function fetchLatestRelease() {
  try {
    const response = await fetch('https://api.github.com/repos/' + GITHUB_REPO + '/releases', {
      headers: {
        Authorization: `token ${GITHUB_DEV_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.statusText}`);
    }

    const releases = await response.json();
    if (!Array.isArray(releases) || releases.length === 0) {
      console.log('No releases found.');
      return null;
    }

    return releases[0];
  } catch (err) {
    console.error('Failed to fetch releases:', err.message);
    return null;
  }
}

/**
 * Posts a message to Discord using a webhook.
 * @param {string} message
 */
async function postToDiscord(message) {
  try {
    const response = await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });

    if (!response.ok) {
      throw new Error(`Failed to post to Discord: ${response.statusText}`);
    }

    console.log('Posted to Discord successfully.');
  } catch (err) {
    console.error('Failed to post to Discord:', err.message);
  }
}

/**
 * Formats the release message using the template.
 * @param {Record<string, string>} releaseData
 * @returns {string}
 */
function formatMessage(releaseData) {
  return MESSAGE_TEMPLATE.replace(/{{\s*(\w+)\s*}}/g, (_, key) => releaseData[key] || '');
}

/**
 * Main function to fetch the latest GitHub release and post it to Discord.
 */
async function main() {
  try {
    await ensureCacheDirectory();

    const cachedIds = await readCache();
    const latestRelease = await fetchLatestRelease();

    if (latestRelease && !cachedIds.includes(latestRelease.tag_name)) {
      const message = formatMessage(latestRelease);
      await postToDiscord(message);

      cachedIds.push(latestRelease.tag_name);
      await writeCache(cachedIds);
    } else {
      console.log('No new releases to post.');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
