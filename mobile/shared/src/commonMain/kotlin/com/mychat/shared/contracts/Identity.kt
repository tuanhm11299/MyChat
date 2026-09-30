package com.mychat.shared.contracts

import kotlinx.serialization.Serializable

// Kotlin mirrors of packages/contracts/src/identity/*.ts.
// When a TypeScript contract changes, update the matching class here
// (see docs/api/contracts.md).

@Serializable
data class RegisterUserRequest(
    val email: String,
    val displayName: String,
    val password: String,
)

@Serializable
data class RegisterUserResponse(
    val id: String,
)

@Serializable
data class UserProfileResponse(
    val id: String,
    val email: String,
    val displayName: String,
    /** ISO-8601 timestamp */
    val createdAt: String,
)
