# Release and versioning policy

## Status and scope

**Status:** current architecture decision for Giada UI release and versioning.

This document defines how Giada UI versions, releases and immutable consumer
references are managed. It applies while the package remains under private
incubation and continues to apply to version semantics after incubation unless
superseded by a later architecture decision.

It does not enable npm registry publication. The repository remains public, the
package manifest remains `private: true`, and the explicit publication guards
remain authoritative.

## Decision

Giada UI uses Semantic Versioning.

The first real release will be `0.1.0`. The current `0.0.0` value represents
the unreleased incubation state and is not a public release.

Releases are created for coherent, reviewed tranches of package evolution. A
release is not required after every merge.

Each release is represented by:

1. one package version;
2. one immutable Git tag using the `v<major>.<minor>.<patch>` form;
3. one GitHub Release associated with that tag;
4. one human-curated `CHANGELOG.md` entry describing the public changes in that
   release.

Git tags and GitHub Releases are the official release history. Moving branches,
including `main`, are not release identifiers.

## Semantic Versioning during `0.x`

Before `1.0.0`, the public API is still stabilizing, but version changes remain
intentional and documented.

For `0.x` releases:

- patch releases contain backward-compatible fixes and documentation or
  packaging corrections that do not deliberately break public contracts;
- minor releases may add backward-compatible public capability;
- deliberate breaking public-contract changes require the next minor release,
  not a patch release;
- every deliberate breaking change must be called out explicitly in the
  changelog and include migration guidance appropriate to the affected public
  contract.

A breaking change includes intentional incompatibility in documented public
runtime APIs, public types, package exports, public stylesheet entry points,
stable documented CSS hooks, accessibility contracts, SSR or hydration
contracts, or supported distribution/consumption behavior.

Internal refactoring that preserves those contracts is not a breaking change.

## Release cadence

Version numbers describe public compatibility, not development activity.

Do not create a release merely because a pull request merged. Prepare a release
when the accumulated `Unreleased` changes form a coherent tranche that is
useful to downstream consumers and has passed the repository validation
contract.

A release candidate must be based on a reviewed commit reachable from `main`.
Release preparation must not bypass the normal pull-request and validation
process.

## Changelog contract

`CHANGELOG.md` is human curated.

During normal development, public changes are accumulated under `Unreleased`.
Release preparation moves the applicable entries into a versioned section with
the release date while preserving meaningful grouping such as Added, Changed,
Fixed, Deprecated, Removed or Security when relevant.

The changelog is not generated from commit messages and must not become a raw
commit log.

Breaking changes during `0.x` must be obvious in the released changelog and
must include migration guidance or a direct link to it.

## Consumer pinning

Consumers must not depend on `main`, another moving branch, or an unqualified
repository reference as a release mechanism.

During private incubation, supported reproducible consumption remains:

- an exact reviewed Git commit SHA; or
- an immutable release tag once releases exist.

A consumer adopting a release tag should pin that exact tag or the immutable
commit it identifies according to the consuming package manager's lockfile
model.

Declared package exports remain the only supported import surface.

## Registry publication boundary

Creating a Git tag or GitHub Release does not imply npm registry publication.

While private incubation remains in force:

- `private: true` remains required;
- `prepublishOnly` continues to refuse publication;
- `scripts/verify-publication-block.mjs` continues to prove the publication
  boundary;
- no registry credentials, publication tokens, OIDC publication permissions,
  dist-tags, npm publication scopes or registry-publishing workflows are
  introduced.

Packability and GitHub releases are intentionally separate from registry
publication.

A future decision to publish to a registry requires an explicit architecture
change and is outside this policy's current incubation scope.

## Criteria for `1.0.0`

`1.0.0` is not triggered by age, component count or repository activity.

Giada UI should reach `1.0.0` only when all of the following are true:

1. multiple real consumers have exercised the package beyond a single
   validation path;
2. the root, Visitor and Studio public surfaces have demonstrated practical
   stability;
3. public ownership boundaries, accessibility behavior, SSR/hydration
   contracts and package distribution semantics are established enough that
   breaking changes are expected to be exceptional;
4. the release process is reproducible and routinely validated;
5. maintainers are prepared to treat breaking public changes as major-version
   events.

Until then, `0.x` communicates deliberate pre-1.0 evolution rather than an
absence of compatibility discipline.

## Release process boundary

The operational release procedure is documented in
[`docs/releases.md`](../releases.md).

Automation may later implement that procedure, but automation must preserve this
decision rather than redefine version semantics.

The first `0.1.0` release, its version bump, tag, GitHub Release and any release
automation are separate work from establishing this policy.
