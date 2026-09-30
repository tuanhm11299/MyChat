package com.mychat.shared

/**
 * `expect` declares something every platform must provide; each platform
 * source set (androidMain, iosMain, jvmMain) has a matching `actual`.
 * Keep expect/actual small: most code should live in commonMain.
 */
expect fun platformName(): String
