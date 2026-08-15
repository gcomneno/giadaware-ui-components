[English](releases.md) | [Italiano](it/releases.md)

# Releases

Giada UI follows the architectural
[release and versioning policy](architecture/release-versioning-policy.md).

This document describes the operational release contract. It does not enable
npm registry publication.

## Current state

The package remains under private incubation.

Until the first real release is prepared:

- `package.json` remains at `0.0.0`;
- no release tag exists;
- downstream consumers may continue to pin exact reviewed Git commit SHAs;
- `private: true` and the registry-publication guards remain unchanged.

The first real release is planned as `0.1.0`.

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
6. merge the reviewed release-preparation change before creating immutable
   release metadata.

Do not manually edit generated package output as the source of a release.

## Creating immutable release metadata

After the release-preparation change is merged and the intended release commit
has been verified:

1. create the annotated Git tag `v<major>.<minor>.<patch>` at that exact
   commit;
2. push that tag without moving or rewriting it;
3. create the corresponding GitHub Release from the same tag;
4. use the curated changelog section as the basis for the GitHub Release notes.

The package version, Git tag and GitHub Release version must agree.

Published release tags must not be force-moved or reused for different content.
If a released version is wrong, correct it with a subsequent SemVer release.

## Consumer usage

Consumers must use immutable references.

During private incubation, supported references are:

- an exact reviewed Git commit SHA;
- an exact release tag once releases exist.

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

## Future automation

Release automation may be introduced separately after the policy and manual
contract are established.

Automation should make the release process reproducible and reduce mechanical
error, but it must preserve:

- explicit SemVer selection;
- the curated changelog;
- the canonical validation gate;
- immutable tag/release identity;
- the registry-publication prohibition.

Automation must not turn every merge into a release.
