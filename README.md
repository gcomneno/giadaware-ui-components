# giadaware-ui-components

Private-incubation Svelte components for GiadaWare.

This is a public GitHub repository containing a package whose manifest uses
`private: true`.

That flag prevents registry publication. It does not make the GitHub
repository private.

During the trial, immutable package artifacts are created with `npm pack`,
identified by source commit, filename and checksum, and installed only in
controlled consumers.

No npm account, organization, scope, registry identity or publication workflow
is required.

Atelier-Kit is the first validation consumer. It is not a dependency of this
package.

The approved trial will contain exactly:

- `SocialIcon`
- `FormStatus`

During bootstrap, the following JavaScript entry graphs are intentionally
empty and isolated:

- `giadaware-ui-components`
- `giadaware-ui-components/visitor`
- `giadaware-ui-components/studio`

The visitor and Studio entry points are reserved for future APIs that must be
approved explicitly.

## Requirements

Node.js:

    ^20.19.0 || >=22.12.0

The repository currently uses Node 24 in CI.

## Requirements

Node.js:

    ^20.19.0 || >=22.12.0

The repository currently uses Node 24 in CI.

## Local validation

Install dependencies:

    npm install

Run all current validation gates:

    npm run validate

Create a local trial artifact:

    npm pack

Registry publication is forbidden during private incubation.

Architecture and trial ownership are tracked in
https://github.com/gcomneno/atelier-kit/issues/127
