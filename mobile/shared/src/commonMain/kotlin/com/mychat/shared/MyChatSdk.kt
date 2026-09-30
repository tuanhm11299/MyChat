package com.mychat.shared

import com.mychat.shared.network.MyChatApi
import com.mychat.shared.network.createHttpClient
import com.mychat.shared.serverstatus.ServerStatusChecker

/**
 * Entry point of the shared library for the apps. It builds the object graph
 * by hand (plain constructor calls, no DI framework), so you can read exactly
 * how things are wired. Create one instance per app.
 *
 * @param apiBaseUrl e.g. "http://10.0.2.2:4000" from the Android emulator,
 *   "http://localhost:4000" from the iOS simulator.
 */
class MyChatSdk(apiBaseUrl: String) {
    private val api = MyChatApi(apiBaseUrl.trimEnd('/'), createHttpClient())

    val serverStatus = ServerStatusChecker(api)
}
