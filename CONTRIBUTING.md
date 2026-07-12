# Contributing

Changes must preserve the private-incubation contract tracked by
gcomneno/atelier-kit#127.

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

The initial component scope is limited to `SocialIcon` and `FormStatus`.

Any additional component requires an explicit architecture decision.
