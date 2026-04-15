# synch-social-icons.ts

Synchronises local SVG icons with the upstream `simple-icons` repository.

The script is intended for folders such as `assets/ananke/socials/` that already contain SVG icon files. By default it runs in dry-run mode, compares local files with upstream files from `simple-icons/icons/`, and reports what would change.

* [Usage](#usage)
* [CLI options](#cli-options)
* [Behaviour](#behaviour)
* [Default mode](#default-mode)
* [Full sync mode](#full-sync-mode)
* [Output states](#output-states)
* [Progress output](#progress-output)
* [JSON output](#json-output)
* [Recommendations](#recommendations)
* [Notes](#notes)
* [Adding new icons](#adding-new-icons)

## Usage

Run in dry-run mode against existing local files only:

```bash
node src/scripts/update-social-icons.ts
```

Run in dry-run mode and show only non-identical results:

```bash
node src/scripts/update-social-icons.ts --only-changed
```

Apply updates to changed local files:

```bash
node src/scripts/update-social-icons.ts --apply
```

Apply updates and delete local files that are not present upstream:

```bash
node src/scripts/update-social-icons.ts --apply --delete
```

Sync against all upstream icons instead of only the files already present locally:

```bash
node src/scripts/update-social-icons.ts --all
```

Create missing local files from upstream:

```bash
node src/scripts/update-social-icons.ts --all --apply
```

Full sync mode including deletion of extra local files:

```bash
node src/scripts/update-social-icons.ts --all --apply --delete
```

Return JSON output for scripting or automation:

```bash
node src/scripts/update-social-icons.ts --all --only-changed --json
```

Set a custom target folder:

```bash
node src/scripts/update-social-icons.ts --dir=assets/ananke/socials
```

Use a different upstream branch:

```bash
node src/scripts/update-social-icons.ts --branch=develop
```

Reduce or increase concurrency:

```bash
node src/scripts/update-social-icons.ts --all --concurrency=4
```

## CLI options

* `--dir <path>`

  * Directory containing local SVG icons
  * Default: `assets/ananke/socials`

* `--branch <name>`

  * Branch in the `simple-icons` repository
  * Default: `develop`

* `--apply`

  * Actually write changes to disk
  * Without this flag the script only reports what would happen

* `--delete`

  * Delete local SVG files that do not exist upstream
  * In dry-run mode this reports `would-delete`
  * In apply mode this deletes files

* `--all`

  * Use the complete upstream icon directory as the source of truth
  * Missing local files become `would-create` in dry-run mode
  * Missing local files are created in apply mode
  * Extra local files can be removed when combined with `--delete`

* `--only-changed`

  * Hide `same` results
  * Useful for shorter reports

* `--json`

  * Print machine-readable JSON output instead of text output

* `--verbose`

  * Show local path and remote URL for each printed result

* `--concurrency <n>`

  * Number of parallel file checks/downloads
  * Default: `8`

* `--help`

  * Show usage help

## Behaviour

## Default mode

Without `--all`, the script only checks local `.svg` files that already exist in the target directory.

For each local file:

* it tries to fetch the matching file from `simple-icons/icons/<filename>`
* if the upstream file is identical, the result is `same`
* if the upstream file differs, the result is `changed`
* if the upstream file does not exist, the result is:

  * `missing` without `--delete`
  * `would-delete` with `--delete` in dry-run mode
  * `deleted` with `--delete --apply`

## Full sync mode

With `--all`, the script first loads the full upstream icon listing from `simple-icons/icons/`.

For each upstream file:

* if the local file does not exist:

  * `would-create` in dry-run mode
  * `created` in apply mode
* if the local file exists and is identical:

  * `same`
* if the local file exists and differs:

  * `changed` in dry-run mode
  * `updated` in apply mode

For local files that do not exist upstream:

* `missing` without `--delete`
* `would-delete` with `--delete` in dry-run mode
* `deleted` with `--delete --apply`

## Output states

* `same`

  * local file matches upstream

* `changed`

  * local file exists, upstream exists, content differs

* `missing`

  * local file exists, upstream file does not exist, and deletion is not enabled

* `would-create`

  * upstream file exists, local file does not exist, dry-run mode

* `created`

  * upstream file exists, local file did not exist, file was created

* `would-delete`

  * local file exists, upstream file does not exist, dry-run mode with `--delete`

* `deleted`

  * local file existed, upstream file does not exist, file was deleted

* `updated`

  * local file existed, upstream file exists, file was overwritten

* `error`

  * processing failed for that file

## Progress output

During text-mode execution, the script shows a one-line progress indicator:

```text
Processing 42/180 (active: 5)
```

This line updates while work is in progress. Individual file results are printed as they complete.

Because processing is concurrent, results may appear in completion order rather than alphabetical order.

## JSON output

When `--json` is used, the script prints a single JSON object containing:

* `options`
* `results`
* `summary`

This is useful for automation or piping into other tools.

Example:

```json
{
  "options": {
    "dir": "/path/to/assets/ananke/socials",
    "branch": "develop",
    "apply": false,
    "deleteMissing": false,
    "onlyChanged": true,
    "json": true,
    "verbose": false,
    "all": true,
    "concurrency": 8
  },
  "results": [
    {
      "fileName": "github.svg",
      "localPath": "/path/to/assets/ananke/socials/github.svg",
      "remoteUrl": "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/github.svg",
      "status": "changed",
      "message": "Upstream file differs from local file"
    }
  ],
  "summary": {
    "same": 0,
    "changed": 1,
    "missing": 0,
    "wouldCreate": 0,
    "created": 0,
    "wouldDelete": 0,
    "deleted": 0,
    "updated": 0,
    "errors": 0
  }
}
```

## Recommendations

* Use dry-run first:

  * `node src/scripts/update-social-icons.ts --only-changed`
* For full folder sync:

  * `node src/scripts/update-social-icons.ts --all --only-changed`
* For actual updates:

  * `node src/scripts/update-social-icons.ts --all --apply`
* For strict mirroring of upstream:

  * `node src/scripts/update-social-icons.ts --all --apply --delete`

## Notes

* Matching is filename-based only.
* The script only works with `.svg` files.
* In `--all` mode, extra custom local icons may be deleted if `--delete` is also used.
* The script uses the GitHub contents API once to list files in `simple-icons/icons/`, then raw file URLs for SVG downloads.
* A moderate concurrency like `4` to `8` is usually a good default.

## Adding new icons

* add the new icon to `assets/ananke/socials/` with the correct filename (e.g. `myicon.svg`)
* it doesn't matter if the content matches the upstream version, as the script will update it
* run the script in dry-run mode to verify the new icon is detected as `changed`
* run the script with `--apply` to update the new icon from upstream
