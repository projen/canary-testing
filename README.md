# @projen/canary-testing

:warning: Do not use! :warning:

This package is used to integration test certain [projen](https://github.com/projen/projen) features that cannot be tested otherwise.
For example:

- Publishing
- Backports
- GitHub Workflows

# Note on vendoring

When vendoring a projen tarball into this repository, be sure to remove the `@`
character from the file name, or you will get the following very confusing
error:

```
error Error: ENOTDIR: not a directory, scandir /some/cache/path/projen-0.0.0-<guid>
```
