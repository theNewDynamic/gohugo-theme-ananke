# Release Policy

This document defines the release workflow for Ananke.

The project follows a structured branching and release strategy based on conventional commits and automated versioning.

## Overview

* `main` is the stable production branch
* `development` is the staging branch
* feature work happens in dedicated branches
* releases and pre-releases are automated via npm scripts

## Versioning

* Version numbers are determined automatically using **conventional commits**
* Do not manually set version numbers
* Commit messages must follow the conventional commits specification

Examples:

* `feat: add new layout option`
* `fix: correct mobile navigation`
* `docs: update configuration guide`

## Branching Model

### main

* Contains only stable, released code
* Updated **only via rebase from `development`**
* Tagged for official releases

### development

* Acts as staging environment
* Receives all feature and fix changes
* Used for testing before release
* Hosts pre-releases

### feature branches

* All work must happen in dedicated branches
* Branch from `development`
* Naming is flexible but should be descriptive

Examples:

* `feature/header-redesign`
* `fix/mobile-menu`
* `docs/improve-installation`

## Pull Request Workflow

* All pull requests must target `development`
* No direct commits to `main` or `development`

### Merging rules

* Feature branches → `development`: **squash merge**
* `development` → `main`: **rebase**

This ensures:

* clean history in `main`
* meaningful commit grouping in `development`

## Release Types

### Pre-releases

Used for testing and validation.

```bash
npm run release:pre
```

* Created from `development`
* Marked as pre-release
* Used for validation before stable release

### Stable releases

```bash
npm run release
```

* Created from `main`
* Tagged as official release
* Represents stable production state

## Release Flow

Typical flow:

1. Create feature branch from `development`
2. Open PR → merge (squash) into `development`
3. Test changes on `development`
4. Create pre-release if needed
5. Rebase `development` → `main`
6. Run stable release on `main`
