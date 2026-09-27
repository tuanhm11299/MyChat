package com.mychat.shared.contracts

import kotlinx.serialization.Serializable

/** Mirrors the response of GET /health (apps/api, check-health slice). */
@Serializable
data class HealthResponse(
    val status: String,
    val database: String,
)
