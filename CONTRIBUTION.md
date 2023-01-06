# Contribution

Any contribution is highly welcome. We accept pull-requests.

## Main assumption

We can **only add features that are supported by all DBs** (included mocked in-memory one).

## Roadmap

To be added in near future:

- transactions
- find options, such as: skip(), take(), sort()
- more integration test cases (and corner cases) for currently supported databases
- more repository implementations for next databases

## Development strategy

The whole IDomainRepository is in one GitHub repo (with all DB implementations). It has only too dependencies:

- Mongoose
- TypeORM

This is not a perfect solution, because each client has to download both of those sub-dependencies when installing the library. However, this is considered non-critial, because:

- for Node.js those unused libraries will be ignored during build
- our testing strategy requires that all of the integration tests are passing all current template tests

## Testing strategy

Assumptions of testing strategy:

- the test templates are created and developed in [test/\_templates](https://github.com/lukaszwilisowski/domain-repository/tree/main/test/_templates).
- **each repository implementation must pass all of the test templates** (MockedDBRepository with unit-tests, real DB repositories with integration-tests)
- real db repositories should be unit-tested as much as possible. For example, in MongoDb we created unit tests tp check if search and update criteria are properly formatted. But in PostgreSQL we have no unit-tests, because the SQL output from TypeORM is too ugly to unit test it (to reconsider in future).
