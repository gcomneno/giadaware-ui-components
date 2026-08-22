[English](releases.md) | [Italiano](it/releases.md)

# Releases

Giada UI follows the architectural
[release and versioning policy](architecture/release-versioning-policy.md).

This document describes the operational release contract. It does not enable
npm registry publication.

## Current state

The package remains under private incubation.

The first real release, `v0.1.0`, was created from package version `0.1.0` on
2026-08-15.

GitHub Immutable Releases is enabled for this repository. In this repository,
an immutable release means both:

- workflow-enforced release identity invariants bind the package version,
  annotated Git tag, remote tag target and GitHub Release tag to the same
  verified commit; and
- for qualifying releases created after GitHub Immutable Releases was enabled,
  GitHub's API reports the resulting release as `immutable: true`.

`v0.1.0` is historical. It was published before platform-level Immutable
Releases was enabled for this repository, so the GitHub Release remains
`immutable: false`. Do not mutate, delete or recreate `v0.1.0` to change that
historical platform state.

Future qualifying releases are expected to use GitHub platform immutability.

Downstream consumers may use:

- an exact reviewed Git commit SHA; or
- an exact release tag whose identity is fixed by this release contract.

`private: true` and the registry-publication guards remain unchanged.

## Preparing a release

A release should represent a coherent tranche of reviewed work rather than an
individual merge.

Release preparation must start from an up-to-date `main` and must preserve the
normal pull-request workflow.

The release change should:

1. choose the SemVer version required by the accumulated public changes;
2. update the package version and every repository-local verification contract
   that intentionally validates that version;
3. move the applicable `CHANGELOG.md` entries from `Unreleased` into a versioned
   section with the release date;
4. document migration guidance for any deliberate breaking `0.x` change;
5. run the canonical repository validation gate and `git diff --check`;
6. merge the reviewed release-preparation change before creating release
   metadata.

Do not manually edit generated package output as the source of a release.

The release workflow does not perform any of these preparation edits.

## Creating release metadata

The normal metadata path is the manually dispatched GitHub Actions
`Release` workflow.

After the release-preparation pull request is merged:

1. verify that `main` points to the intended release commit;
2. open **Actions → Release → Run workflow**;
3. select `main`;
4. enter the prepared SemVer version without the `v` prefix;
5. run the workflow.

The workflow fails closed unless:

- it runs from the current `main` commit;
- `package.json` uses the requested version;
- both package-lock version fields use the requested version;
- the repository-local manifest verifier deliberately expects that version;
- `CHANGELOG.md` contains a non-empty dated section for that version;
- `private: true` and the explicit `prepublishOnly` refusal guard remain intact;
- no `publishConfig` is present;
- the requested Git tag and GitHub Release do not already exist.

Before mutating release metadata, the workflow installs the locked
dependencies, installs Chromium and runs the canonical `npm run validate` gate.

It then:

1. extracts release notes from the human-curated changelog section;
2. creates the annotated Git tag `v<major>.<minor>.<patch>` at the exact workflow
   commit;
3. pushes that annotated tag;
4. verifies the remote tag target;
5. creates the corresponding GitHub Release from the same tag and notes;
6. verifies that the GitHub Release uses the expected tag;
7. verifies through GitHub's API that the new GitHub Release is reported as
   `immutable: true`.

The package version, Git tag and GitHub Release version must agree.

Published release tags must not be force-moved or reused for different content.
If a released version is wrong, correct it with a subsequent SemVer release.

If automation fails after the annotated tag has already been pushed, do not
delete, move or recreate the tag merely to retry the workflow. Inspect the
partial release state and complete or correct it deliberately.

## Manual fallback

If GitHub Actions is unavailable, maintainers may perform the same contract
manually.

The fallback must still:

1. use the exact verified `main` release commit;
2. run `npm run validate`;
3. run the release-readiness verifier for the requested version;
4. create an annotated `v<version>` tag on that exact commit;
5. push the tag without rewriting it;
6. create the GitHub Release from the same tag using the curated changelog
   section;
7. verify the resulting tag and release identity;
8. for future qualifying releases, verify through GitHub's API that the GitHub
   Release is reported as `immutable: true`.

Automation and manual fallback implement the same release contract.

## Consumer usage

Consumers must use fixed release references.

During private incubation, supported references are:

- an exact reviewed Git commit SHA;
- an exact release tag.

Do not depend on `main` or another moving branch as a release reference.

Consumers must continue to import only declared package exports rather than
repository `src/` paths.

See
[Git dependency consumption](git-dependency-consumption.md)
for the incubation installation contract.

## Registry publication remains blocked

GitHub Releases and Git tags are not npm publication.

A release must not add or bypass:

- npm registry publication configuration;
- registry credentials or publication tokens;
- OIDC publication permissions;
- dist-tags;
- publication-oriented npm scopes or organizations;
- workflows that publish the package to a registry.

`private: true`, `prepublishOnly` and the publication verification gate remain
in force until a separate architecture decision explicitly changes the
incubation model.

The release workflow uses repository-scoped GitHub permissions only to create
the Git tag and GitHub Release and to verify the resulting release metadata. It
does not publish the package to an npm registry.

## Automation boundary

Release automation reduces mechanical error; it does not select release
semantics.

It preserves:

- explicit SemVer selection;
- a human-curated changelog;
- reviewed release preparation through a pull request;
- the canonical validation gate;
- release identity invariants;
- GitHub platform immutability for future qualifying releases;
- the registry-publication prohibition.

The workflow is manual-only and does not turn merges or pushes into releases.
