package com.trading.ai

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

data class StrategyLevel(
    val level: Int,
    val side: String,
    val entry: Double,
    val qty: Int,
    val tp: Double,
    val sl: Double
)

data class TradeRecord(
    val symbol: String,
    val time: String,
    val result: String
)

data class TradingUiState(
    val strategyLevels: List<StrategyLevel> = listOf(
        StrategyLevel(1, "BUY", 846.9, 25, 852.2, 840.5),
        StrategyLevel(2, "BUY", 842.8, 20, 847.0, 836.4),
        StrategyLevel(3, "BUY", 839.4, 15, 844.3, 833.1)
    ),
    val trades: List<TradeRecord> = listOf(
        TradeRecord("SBIN", "09:15", "+₹1,280"),
        TradeRecord("RELIANCE", "10:20", "+₹2,440"),
        TradeRecord("TCS", "11:45", "-₹640"),
        TradeRecord("NIFTY", "12:00", "+₹4,120")
    )
)

class TradingViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(TradingUiState())
    val uiState: StateFlow<TradingUiState> = _uiState.asStateFlow()
}
