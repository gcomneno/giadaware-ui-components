# Git dependency consumption

GIADA UI is intentionally not published to a package registry during its private-incubation phase, but downstream GiadaWare applications still need a reproducible way to consume the real Svelte package without copying components.

## Supported incubation path

Downstream projects may pin this repository as a Git dependency at an exact commit SHA.

For that workflow to work, npm must be able to materialize the package `dist/` directory after cloning the dependency. The repository therefore treats its `prepare` lifecycle as a package-build step and runs the same `svelte-package` pipeline used by `npm run package`.

This does **not** enable registry publication. `prepublishOnly` continues to reject publication and `private: true` remains unchanged.

## Downstream rule

Pin an exact reviewed commit rather than a moving branch. This keeps UI dependencies reproducible while GIADA UI remains unpublished.

Consumers must use the declared package exports (`giadaware-ui-components`, `/visitor`, `/studio` and the style exports) rather than importing files from `src/`.
