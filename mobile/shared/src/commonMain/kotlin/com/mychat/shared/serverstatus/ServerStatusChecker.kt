package com.mychat.shared.serverstatus

import com.mychat.shared.network.MyChatApi
import kotlin.coroutines.cancellation.CancellationException

/** What the UI shows about the backend. A sealed class lets `when` cover every case. */
sealed class ServerStatus {
    data object Online : ServerStatus()
    data class Offline(val reason: String) : ServerStatus()
}

/**
 * First shared feature: asks the API whether it (and its database) is up.
 * Both the Android and the iOS app call this same code.
 */
class ServerStatusChecker(private val api: MyChatApi) {
    // @Throws lets Swift call this as `try await checker.check()`.
    @Throws(CancellationException::class)
    suspend fun check(): ServerStatus =
        try {
            val health = api.health()
            if (health.status == "ok") ServerStatus.Online else ServerStatus.Offline("status: ${health.status}")
        } catch (e: CancellationException) {
            throw e // never swallow coroutine cancellation
        } catch (e: Exception) {
            ServerStatus.Offline(e.message ?: "unknown error")
        }
}
