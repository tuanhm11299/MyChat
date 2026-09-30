# How to add a mobile feature (KMP shared + Android + iOS)

Reference: the server-status feature.

- Shared: `mobile/shared/src/commonMain/kotlin/com/mychat/shared/serverstatus/ServerStatusChecker.kt`
- Android: `mobile/androidApp/src/main/kotlin/com/mychat/android/ServerStatusScreen.kt`
- iOS: `mobile/iosApp/iosApp/ServerStatusView.swift`

Example: show a user's profile.

## 1. Contract mirror (shared)

If the API response isn't mirrored yet, add a `@Serializable data class` in
`shared/src/commonMain/kotlin/com/mychat/shared/contracts/` with the **same field names** as the
TypeScript contract (here `UserProfileResponse` already exists).

## 2. API call (shared, `network/MyChatApi.kt`)

Add one `suspend fun` per endpoint (`getUserProfile` already exists). Use `.bodyOrThrow()` so
errors become `ApiException`.

## 3. Feature logic (shared, new package `profile/`)

```kotlin
class ProfileLoader(private val api: MyChatApi) {
    @Throws(CancellationException::class)
    suspend fun load(userId: String): ProfileState =
        try {
            ProfileState.Loaded(api.getUserProfile(userId))
        } catch (e: CancellationException) {
            throw e
        } catch (e: ApiException) {
            ProfileState.Error(e.message ?: "Unknown error")
        }
}

sealed class ProfileState {
    data class Loaded(val profile: UserProfileResponse) : ProfileState()
    data class Error(val message: String) : ProfileState()
}
```

- Return a **sealed class** so both UIs must handle every case.
- `@Throws(CancellationException::class)` makes it callable from Swift with `try await`.

## 4. Expose it in `MyChatSdk`

```kotlin
val profileLoader = ProfileLoader(api)
```

## 5. Test it (shared, `commonTest/`)

Copy the pattern of `ServerStatusCheckerTest`: build `MyChatApi` with a `MockEngine`, return a
canned JSON response, assert the resulting state. Run:

```sh
cd mobile && ./gradlew :shared:jvmTest
```

## 6. Android screen (Compose)

A `@Composable` that takes the loader, calls it in `LaunchedEffect`, and renders the state with a
`when`. Get the SDK from `MyChatApplication`.

## 7. iOS view (SwiftUI)

A `View` with `@State private var state: ProfileState?`, loading in `.task { state = try? await loader.load(userId: id) }`,
and a `switch` using `case let loaded as ProfileState.Loaded:`.

## Checklist

- [ ] Logic in `shared`, not duplicated in the apps
- [ ] Contract mirror matches TypeScript field names
- [ ] `commonTest` test with `MockEngine`
- [ ] Android and iOS screens both handle every state
