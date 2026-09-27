package com.mychat.shared

actual fun platformName(): String = "JVM ${System.getProperty("java.version")}"
