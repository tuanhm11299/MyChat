import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.kotlin.multiplatform)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.android.library)
}

kotlin {
    // Targets: where this library is compiled to.
    androidTarget {
        compilerOptions { jvmTarget.set(JvmTarget.JVM_17) }
    }

    // iOS: device (arm64) + simulators (Apple Silicon and Intel Macs).
    // Each produces a "Shared" framework that the Xcode project imports.
    listOf(iosArm64(), iosSimulatorArm64(), iosX64()).forEach { target ->
        target.binaries.framework {
            baseName = "Shared"
            isStatic = true
        }
    }

    // Plain JVM target. It lets `./gradlew :shared:jvmTest` run the shared tests
    // on any machine (no Android SDK, no Mac), which keeps CI fast.
    jvm()

    // Source sets: which code is compiled for which targets.
    // commonMain is shared by all; <platform>Main holds `actual` implementations
    // and platform-specific dependencies.
    sourceSets {
        commonMain.dependencies {
            implementation(libs.kotlinx.coroutines.core)
            implementation(libs.kotlinx.serialization.json)
            implementation(libs.ktor.client.core)
            implementation(libs.ktor.client.content.negotiation)
            implementation(libs.ktor.serialization.kotlinx.json)
        }
        commonTest.dependencies {
            implementation(kotlin("test"))
            implementation(libs.kotlinx.coroutines.test)
            implementation(libs.ktor.client.mock)
        }
        // Each platform gets the HTTP engine native to it. Ktor picks it up automatically.
        androidMain.dependencies {
            implementation(libs.ktor.client.okhttp)
            // Ktor 3.6 brings OkHttp 5.5, whose Android artifact demands compileSdk 37 (AGP 9.4+).
            // 5.4 works with compileSdk 36 and is API-compatible with Ktor's engine.
            implementation("com.squareup.okhttp3:okhttp") {
                version { strictly(libs.versions.okhttp.get()) }
            }
        }
        iosMain.dependencies {
            implementation(libs.ktor.client.darwin)
        }
        jvmMain.dependencies {
            implementation(libs.ktor.client.cio)
        }
    }
}

android {
    namespace = "com.mychat.shared"
    compileSdk = libs.versions.android.compileSdk.get().toInt()
    defaultConfig {
        minSdk = libs.versions.android.minSdk.get().toInt()
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
