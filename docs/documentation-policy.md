[English](documentation-policy.md) | [Italiano](it/documentation-policy.md)

# Documentation policy

English is the canonical source of truth for GiadaWare UI Components public
documentation.

Italian is an official maintained mirror for the public documentation surface.
Italian mirrors are not summaries: they must preserve normative requirements,
public contracts, examples, warnings, limitations, ownership boundaries,
accessibility semantics, SSR and hydration guarantees, package and distribution
rules, and technical meaning.

When an in-scope canonical English document changes, the same pull request must
evaluate and update its maintained Italian mirror. Reciprocal language selectors
are required in every maintained bilingual document. Same-language navigation
must be used when a maintained mirror exists.

Technical identifiers and code remain canonical. Do not translate package
names, imports or exports, Svelte or TypeScript symbols, prop or type names,
filenames and paths, shell commands, environment variables, CSS custom
properties, HTML or ARIA attribute names, literal closed-union values, or code
blocks where translation would change executable or example semantics.
Natural-language strings inside illustrative code examples may remain English
when translating them would create unnecessary divergence.

Semantic translation parity is a reviewer responsibility. The automated
documentation verifier checks the maintained file, selector, link and
same-language navigation contract; it does not prove translation quality.

The following documents remain English-only:

- `docs/architecture/**`
- `SECURITY.md`
- `CHANGELOG.md`
- `AGENTS.md`
- `THIRD_PARTY_NOTICES.md`

Public components documented only in `README.md` do not gain speculative
dedicated documentation pages through the bilingual documentation contract.
