---
agent: ask
model: gpt-5
tools: ["codebase", "editFiles", "runCommands"]
name: create-test-script
description: Create or extend a Hugo-based output test script from a structured test request.
argument-hint: |
  Please provide the following information in markdown format:

  ```md
  changes:
  - ...

  build command:
  - ...

  assertions:
  - should contain ...
  - should not contain ...
  - file should exist ...
  - file should not exist ...

  scope:
  - new script
  - extend existing script: path/to/script.ts
  ```
---

# /create-test

Create or extend a repository test script by following the existing Hugo test pattern used in this codebase.
Use the quickstart test logic from `scripts/test-hugo-quickstart.ts` as baseline.

The default behaviour is to create a **new script** unless the user explicitly says to extend an existing one.

## Behaviour

You must collect and use these four input sections:

1. **changes**
2. **build command**
3. **assertions**
4. **scope**

If any of these sections are missing, unclear, empty, or contradictory, you must stop and ask the user for the missing information before writing code.

Do not guess silently when one of these sections is missing.

## Input schema

The user should provide input in this structure:

```md
changes:
- ...

build command:
- ...

assertions:
- should contain ...
- should not contain ...
- file should exist ...
- file should not exist ...

scope:
- new script
- extend existing script: path/to/script.ts
```

## Questions to ask if information is missing

If one or more sections are missing, ask only for the missing parts.

Use these prompts:

* **changes**
  "What source, content, config, or file changes should the test perform before rebuilding?"

* **build command**
  "Which build command should regenerate the output after the changes? Example: `hugo` or `hugo --buildDrafts`."

* **assertions**
  "What exact result should the test verify in the generated output under `public/`? You can describe content, HTML, existing files, missing files, or text that must not appear."

* **scope**
  "Should I create a new script or extend an existing one? Default is a new script."

If the user says "use the usual pattern" or similar, interpret that as:

* mutate source or config
* run the requested build command
* inspect generated output in `public/`
* fail on mismatch
* keep temp directory on failure if the existing test style already does that

## Common assertion examples

If the user asks for examples, offer examples like these:

* "should contain `<strong>bold</strong>`"
* "should contain `<html lang=\"en-gb\">`"
* "should contain `Ananke Test Quickstart`"
* "should not contain `My First Post`"
* "file should exist: `public/index.html`"
* "file should exist: `public/foo/index.html`"
* "file should not exist: `public/foo/index.html`"
* "should contain a link to `https://gohugo.io`"
* "should render `## Introduction` as an `<h2>` element"

## Implementation rules

When generating or modifying the test script:

* follow the established repository testing style
* prefer TypeScript if the existing test script is TypeScript
* keep code copy-paste ready
* include proper error handling
* make assertions explicit and readable
* always rebuild before testing generated files in `public/`
* do not inspect `public/` after source-only commands unless a build command has been run afterwards
* if scope is not specified, create a new script
* if extending an existing script, preserve the existing flow unless the user explicitly asks for a refactor
* do not remove existing checks unless the user explicitly asks for that

## Build logic rules

Treat the build command as the command that makes output testable.

General pattern:

1. apply **changes**
2. run the requested **build command**
3. inspect generated output in `public/`
4. fail if assertions do not match

When in doubt, rebuild before testing.

## Output requirements

After you have enough information:

* create or update the script
* explain briefly what was added
* include the full script or the exact diff, depending on the user's request
* if relevant, include the npm script entry or workflow update needed to run it

## User input

Wait for the user to provide:

* **changes**
* **build command**
* **assertions**
* **scope**

## Execution mode

Do not modify files until all four required sections are present and confirmed.
