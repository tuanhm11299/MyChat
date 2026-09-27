package com.mychat.shared.network

import com.mychat.shared.contracts.ApiErrorResponse
import com.mychat.shared.contracts.HealthResponse
import com.mychat.shared.contracts.RegisterUserRequest
import com.mychat.shared.contracts.RegisterUserResponse
import com.mychat.shared.contracts.UserProfileResponse
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.http.isSuccess

/** Thrown for every non-2xx response. [code] comes from the API, e.g. "identity.email_already_taken". */
class ApiException(
    val statusCode: Int,
    val code: String,
    message: String,
) : Exception(message)

/**
 * Typed wrapper around the MyChat REST API: one function per endpoint.
 * The single place in the mobile code that knows URLs and HTTP details.
 */
class MyChatApi(
    private val baseUrl: String,
    private val client: HttpClient,
) {
    suspend fun health(): HealthResponse = client.get("$baseUrl/health").bodyOrThrow()

    suspend fun registerUser(request: RegisterUserRequest): RegisterUserResponse =
        client.post("$baseUrl/auth/register") {
            contentType(ContentType.Application.Json)
            setBody(request)
        }.bodyOrThrow()

    suspend fun getUserProfile(userId: String): UserProfileResponse =
        client.get("$baseUrl/users/$userId").bodyOrThrow()

    private suspend inline fun <reified T> HttpResponse.bodyOrThrow(): T {
        if (status.isSuccess()) return body()
        val error = runCatching { body<ApiErrorResponse>() }.getOrNull()
        throw ApiException(
            statusCode = status.value,
            code = error?.code ?: "unknown",
            message = error?.message ?: "Request failed with status ${status.value}",
        )
    }
}
