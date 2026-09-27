package com.mychat.android

import android.app.Application
import com.mychat.shared.MyChatSdk

/** Holds the single MyChatSdk instance for the whole app. */
class MyChatApplication : Application() {
    val sdk: MyChatSdk by lazy { MyChatSdk(apiBaseUrl = BuildConfig.API_BASE_URL) }
}
