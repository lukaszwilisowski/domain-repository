# Contribution

Any contribution is highly welcome. We accept pull-requests.

## Main assumption

We can **only add features that are supported by all DBs** (included mocked in-memory one).

---

## Roadmap

Our assumptions are simple:

- simplify db usage in standard, code-based architecture
- support standard db use cases, used in majority of the projects
- ignore specific db features, used in specific projects

Missing features to be added soon:

- transactions
- find options, such as: skip(), take(), sort()
- more integration test cases (and corner cases) for currently supported databases
- more repository implementations for next databases

---

## Development strategy

The whole IDomainRepository is in one GitHub repo (with all DB implementations). It has only two dependencies:

- Mongoose
- TypeORM

One downside of this approach is that each client has to download both of those sub-dependencies when installing the library. But this is a necessary requirement, if we want to keep test templates and actual tests in the same repo (to make sure both are always up-to-date). Splitting the packages at the moment would be an overkill, because:

- imports are already isolated in specific index.ts files (so there is no risk that by using mongodb repository you will import typeorm dependencies and vice-versa)
- in Node.js unused libraries are ignored anyways (not compiled), so it only affects the size of node-modules folder

---

## Testing strategy

The main assumption of this project is that **each repository implementation must pass all of the test templates** (test cases for abstract IDomainRepository):

- the test cases can be found in [test/\_templates](https://github.com/lukaszwilisowski/domain-repository/tree/main/test/_templates)
- the actual tests can be found in: [test/db](https://github.com/lukaszwilisowski/domain-repository/tree/main/test/db)
- the new test cases are much welcome, to make sure we support all use-cases and corner-cases in each database
- if you add a new test case, you must ensure that all unit tests (\*.tests.ts). and integration tests pass (\*.int-tests.ts).
- when possible, real db repositories should have additional unit-tests. For example, in MongoDb we created unit tests to check if search criteria and update criteria are properly formatted. But in PostgreSQL we have no unit-tests, because the SQL output from TypeORM is too ugly to unit test it (to reconsider in future).
