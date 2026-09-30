package com.mychat.shared

import android.os.Build

actual fun platformName(): String = "Android ${Build.VERSION.RELEASE}"
