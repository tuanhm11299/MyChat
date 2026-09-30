---
name: kmp-feature
description: Add a mobile feature with Kotlin Multiplatform - shared logic, Ktor call, contract mirror and commonTest, plus native Jetpack Compose and SwiftUI screens. Use for any work in mobile/.
---

# Add a KMP feature

Architecture (source of truth): `docs/architecture/mobile-kmp.md`
Guides: `docs/guides/kmp-add-feature.md`, `docs/guides/kmp-for-beginners.md`
Reference: `ServerStatusChecker` (shared) → `ServerStatusScreen.kt` (Android) → `ServerStatusView.swift` (iOS).

The project owner is learning KMP. Keep code idiomatic and explain KMP-specific choices in comments.

## Checklist

1. Contract mirror (`shared/src/commonMain/.../contracts/`), same field names as TypeScript.
2. Endpoint function in `network/MyChatApi.kt` using `bodyOrThrow()`.
3. Feature class in its own package in `commonMain`: `suspend` functions with
   `@Throws(CancellationException::class)`, returning a sealed state class; rethrow `CancellationException`.
4. Expose it from `MyChatSdk`.
5. `commonTest` test with Ktor `MockEngine`; run `cd mobile && ./gradlew :shared:jvmTest`.
6. Android: Compose screen in `androidApp/` (`LaunchedEffect` + `when` over states).
7. iOS: SwiftUI view in `iosApp/iosApp/` (`.task { try? await ... }` + `switch` with `as` casts).
8. New dependencies only via `gradle/libs.versions.toml`.

Building Android needs the Android SDK; building iOS needs macOS. Say so if you couldn't verify them.
