# iosApp

SwiftUI app that uses the Kotlin `shared` module as the `Shared` framework.

Requirements: a Mac with Xcode 16+ and [XcodeGen](https://github.com/yonaskolb/XcodeGen).

```sh
brew install xcodegen
cd mobile/iosApp
xcodegen generate        # creates iosApp.xcodeproj from project.yml (not committed)
open iosApp.xcodeproj    # then Run on an iOS simulator
```

The Xcode build runs `./gradlew :shared:embedAndSignAppleFrameworkForXcode` first,
so Kotlin changes are picked up automatically. Start the API (`pnpm --filter @mychat/api dev`)
to see "Server is online".

See docs/guides/kmp-for-beginners.md for how Swift calls Kotlin.
