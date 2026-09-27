package com.mychat.shared.network

import io.ktor.client.HttpClient
import io.ktor.client.HttpClientConfig
import io.ktor.client.engine.HttpClientEngine
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

/**
 * Creates the Ktor client used for every API call.
 *
 * @param engine leave null in the apps (Ktor uses the platform engine: OkHttp on
 *   Android, Darwin on iOS). Tests pass a MockEngine.
 */
fun createHttpClient(engine: HttpClientEngine? = null): HttpClient {
    val configure: HttpClientConfig<*>.() -> Unit = {
        install(ContentNegotiation) {
            json(
                Json {
                    // New fields added by the API must not crash older app versions.
                    ignoreUnknownKeys = true
                },
            )
        }
    }
    return if (engine == null) HttpClient(configure) else HttpClient(engine, configure)
}
