rootProject.name = "MyChat"

pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
    }
}

// shared:     Kotlin Multiplatform library (business logic, networking), used by both apps
// androidApp: Android app, UI in Jetpack Compose
// iosApp:     iOS app, UI in SwiftUI. Not a Gradle module: it is an Xcode project (see iosApp/README.md)
include(":shared")
include(":androidApp")
