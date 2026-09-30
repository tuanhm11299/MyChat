package com.mychat.shared.contracts

import kotlinx.serialization.Serializable

/** Mirrors packages/contracts/src/errors.ts: the body of every API error response. */
@Serializable
data class ApiErrorResponse(
    val statusCode: Int,
    val code: String = "unknown",
    val message: String = "",
)
