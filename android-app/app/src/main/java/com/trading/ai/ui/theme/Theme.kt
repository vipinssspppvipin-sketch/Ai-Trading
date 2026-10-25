package com.trading.ai.data

data class StrategyPlan(
    val levels: List<StrategyLevel>
)

data class StrategyLevel(
    val level: Int,
    val side: String,
    val entry: Double,
    val qty: Int,
    val tp: Double,
    val sl: Double
)

class StrategyEngine {
    fun buildPlan(
        ltp: Double,
        side: String,
        totalQty: Int,
        offsets: List<Double>,
        tpOffset: Double,
        slOffset: Double
    ): List<StrategyLevel> {
        val direction = if (side == "BUY") 1.0 else -1.0
        val weights = listOf(0.35, 0.25, 0.2, 0.2)

        return offsets.mapIndexed { index, offset ->
            val entry = (ltp + (direction * offset)).toDouble()
            val qty = maxOf(1, (totalQty * (weights.getOrElse(index) { 0.2 })).toInt())
            val tp = entry + (if (side == "BUY") tpOffset else -tpOffset)
            val sl = entry - (if (side == "BUY") slOffset else -slOffset)
            StrategyLevel(index + 1, side, entry, qty, tp, sl)
        }
    }
}
