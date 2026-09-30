# MyChat documentation

Start with the [root README](../README.md) for the quickstart and [CONTRIBUTING.md](../CONTRIBUTING.md) for the workflow.

| I want to…                                | Read                                                     |
| ----------------------------------------- | -------------------------------------------------------- |
| Understand the whole system               | [architecture/overview.md](architecture/overview.md)     |
| Understand the backend layers and CQRS    | [architecture/backend.md](architecture/backend.md)       |
| Understand realtime (WebSocket) messaging | [architecture/realtime.md](architecture/realtime.md)     |
| Understand the web app                    | [architecture/web.md](architecture/web.md)               |
| Understand the mobile apps (KMP)          | [architecture/mobile-kmp.md](architecture/mobile-kmp.md) |
| See every endpoint and event              | [api/contracts.md](api/contracts.md)                     |
| Set up my machine, run and test things    | [development.md](development.md)                         |
| Know what is built next                   | [roadmap.md](roadmap.md)                                 |
| Know why a technology was chosen          | [adr/](adr/) (Architecture Decision Records)             |
| Look up a term (aggregate, slice, port…)  | [glossary.md](glossary.md)                               |

## Step-by-step guides

| Task                                      | Guide                                                                      |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| Add a backend use case (command or query) | [guides/backend-add-feature-slice.md](guides/backend-add-feature-slice.md) |
| Add a domain aggregate + its persistence  | [guides/backend-add-aggregate.md](guides/backend-add-aggregate.md)         |
| Change the database schema                | [guides/database-migrations.md](guides/database-migrations.md)             |
| Add a realtime event                      | [guides/realtime-add-event.md](guides/realtime-add-event.md)               |
| Add a web feature                         | [guides/web-add-feature.md](guides/web-add-feature.md)                     |
| Add a mobile feature                      | [guides/kmp-add-feature.md](guides/kmp-add-feature.md)                     |
| Learn Kotlin Multiplatform basics         | [guides/kmp-for-beginners.md](guides/kmp-for-beginners.md)                 |
| Fix a broken setup                        | [guides/troubleshooting.md](guides/troubleshooting.md)                     |
