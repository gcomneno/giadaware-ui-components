[English](CONTRIBUTING.md) | [Italiano](CONTRIBUTING.it.md)

# Contributing

Changes must preserve the private-incubation contract tracked by
gcomneno/atelier-kit#127.

Public documentation changes must preserve the bilingual contract in
[docs/documentation-policy.md](docs/documentation-policy.md). When an in-scope
canonical English document changes, evaluate and update its maintained Italian
mirror in the same pull request, keep reciprocal language selectors valid, and
run `npm run verify:docs`.

Release preparation must follow [docs/releases.md](docs/releases.md) and the
underlying
[architecture policy](docs/architecture/release-versioning-policy.md).
Normal feature merges do not require a release, and release work must not
enable registry publication.

Before opening a pull request, run:

    npm install
    npm run validate
    git diff --check

Do not add:

- npm publication configuration;
- registry credentials or tokens;
- OIDC publication permissions;
- dist-tags;
- npm scopes or organizations;
- release workflows that publish the package.

The component scope consists only of components approved through explicit
architecture decisions. Every additional component still requires its own
explicit architecture decision before implementation.
