# Kotlin Multiplatform for beginners (MyChat edition)

Short learning notes, each tied to real code in `mobile/`.

## 1. One module, many targets

`mobile/shared/build.gradle.kts` declares **targets**: `androidTarget()`, `iosArm64()`,
`iosSimulatorArm64()`, `iosX64()`, `jvm()`. Kotlin compiles the same code for each:

- Android/JVM → JVM bytecode (a normal library)
- iOS → native machine code, packaged as `Shared.framework` for Xcode

## 2. Source sets

| Folder        | Compiled for    | Can use                                                                           |
| ------------- | --------------- | --------------------------------------------------------------------------------- |
| `commonMain`  | every target    | Kotlin stdlib + multiplatform libraries (coroutines, Ktor, kotlinx.serialization) |
| `androidMain` | Android         | Android SDK + Java libraries                                                      |
| `iosMain`     | all iOS targets | Apple frameworks (`platform.UIKit.*`, `platform.Foundation.*`)                    |
| `jvmMain`     | JVM             | Java libraries                                                                    |
| `commonTest`  | every target    | `kotlin.test`                                                                     |

Put code in `commonMain` whenever possible.

## 3. expect / actual

When common code needs something only a platform can provide:

```kotlin
// commonMain/Platform.kt
expect fun platformName(): String

// androidMain/Platform.android.kt
actual fun platformName(): String = "Android ${Build.VERSION.RELEASE}"

// iosMain/Platform.ios.kt
actual fun platformName(): String = UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
```

Prefer **interfaces + constructor injection** for bigger things (e.g. a `TokenStorage` interface
implemented per platform and passed into `MyChatSdk`). `expect`/`actual` is best for small leaf
functions.

## 4. Multiplatform libraries used here

| Library               | Why                                                                          |
| --------------------- | ---------------------------------------------------------------------------- |
| kotlinx.coroutines    | `suspend` functions and `Flow` (async code)                                  |
| Ktor client           | HTTP + WebSocket. Each platform uses its native engine (OkHttp, Darwin, CIO) |
| kotlinx.serialization | JSON ↔ `@Serializable` data classes                                          |

## 5. Calling Kotlin from Swift

After `import Shared`:

| Kotlin                                               | Swift                                                           |
| ---------------------------------------------------- | --------------------------------------------------------------- |
| `class MyChatSdk(apiBaseUrl: String)`                | `MyChatSdk(apiBaseUrl: "…")`                                    |
| top-level `fun platformName()` in `Platform.kt`      | `PlatformKt.platformName()`                                     |
| `suspend fun check(): ServerStatus` with `@Throws`   | `try await checker.check()`                                     |
| `sealed class ServerStatus { data object Online … }` | `status is ServerStatus.Online`                                 |
| `data class Offline(val reason: String)`             | `(status as? ServerStatus.Offline)?.reason`                     |
| `Flow<T>`                                            | Not directly usable. Needs a wrapper or SKIE (Phase 5 decision) |

Tips:

- Keep the API you expose to Swift small and simple: plain classes, sealed classes, suspend functions.
- Kotlin `Int` is `Int32` in Swift; `List<T>` becomes `[T]`; nullable types become optionals.
- Generics on interfaces are lost in Objective-C export; prefer concrete types in public APIs.

## 6. How the iOS app gets the framework

`iosApp/project.yml` adds a pre-build step running
`./gradlew :shared:embedAndSignAppleFrameworkForXcode`. Xcode tells Gradle the target
(simulator/device, debug/release), Gradle builds the matching `Shared.framework`, and Xcode links it.
You never copy frameworks by hand.

## 7. Running tests

`./gradlew :shared:jvmTest` runs `commonTest` on the JVM: fast, works on Linux. `./gradlew :shared:allTests`
also runs them on iOS simulators (macOS only).

## Further reading

- Kotlin docs: https://kotlinlang.org/docs/multiplatform.html
- Ktor client: https://ktor.io/docs/client-create-multiplatform-application.html
- Swift interop: https://kotlinlang.org/docs/native-objc-interop.html
