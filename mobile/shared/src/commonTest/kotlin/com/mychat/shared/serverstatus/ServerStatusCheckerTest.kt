package com.mychat.shared.serverstatus

import com.mychat.shared.network.MyChatApi
import com.mychat.shared.network.createHttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.headersOf
import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertIs

class ServerStatusCheckerTest {
    private fun checkerRespondingWith(status: HttpStatusCode, body: String): ServerStatusChecker {
        val engine = MockEngine { request ->
            assertEquals("/health", request.url.encodedPath)
            respond(body, status, headersOf(HttpHeaders.ContentType, "application/json"))
        }
        return ServerStatusChecker(MyChatApi("http://api.test", createHttpClient(engine)))
    }

    @Test
    fun reportsOnlineWhenTheApiIsHealthy() = runTest {
        val checker = checkerRespondingWith(HttpStatusCode.OK, """{"status":"ok","database":"up"}""")

        assertEquals(ServerStatus.Online, checker.check())
    }

    @Test
    fun reportsOfflineWithTheApiMessageWhenTheApiFails() = runTest {
        val checker = checkerRespondingWith(
            HttpStatusCode.InternalServerError,
            """{"statusCode":500,"code":"internal","message":"Database unreachable"}""",
        )

        val status = checker.check()

        assertIs<ServerStatus.Offline>(status)
        assertEquals("Database unreachable", status.reason)
    }
}
