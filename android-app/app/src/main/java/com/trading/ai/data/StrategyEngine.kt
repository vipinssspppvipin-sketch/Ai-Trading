package com.trading.ai.data

import kotlinx.serialization.Serializable

@Serializable
data class AngelOneCredentials(
    val apiKey: String,
    val clientCode: String,
    val password: String,
    val totp: String
)

class AngelOneRepository {
    suspend fun login(credentials: AngelOneCredentials): String {
        // TODO: integrate with Angel One SmartAPI backend
        return "demo_jwt_token"
    }

    suspend fun getMarketQuote(symbol: String): Map<String, Any> {
        // TODO: integrate with secure backend quote endpoint
        return mapOf(
            "symbol" to symbol,
            "ltp" to 846.90,
            "change" to 12.4,
            "volume" to 4512340
        )
    }
}
