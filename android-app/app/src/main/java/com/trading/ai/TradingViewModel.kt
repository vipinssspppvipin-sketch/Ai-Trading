package com.trading.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.trading.ai.ui.theme.AITradingTheme
import com.trading.ai.ui.theme.Green
import com.trading.ai.ui.theme.Orange
import com.trading.ai.ui.theme.Red
import com.trading.ai.ui.theme.SurfaceDark
import com.trading.ai.ui.theme.TextPrimary
import com.trading.ai.ui.theme.TextSecondary
import java.text.DecimalFormat

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AITradingTheme {
                val viewModel: TradingViewModel = viewModel()
                TradingDashboardScreen(viewModel)
            }
        }
    }
}

@Composable
fun TradingDashboardScreen(viewModel: TradingViewModel) {
    val state by viewModel.uiState.collectAsState()

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = SurfaceDark
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            TopBar()

            Spacer(modifier = Modifier.height(16.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                MetricCard(
                    title = "Portfolio",
                    value = "₹12.48L",
                    trend = "+3.8%",
                    positive = true,
                    modifier = Modifier.weight(1f)
                )
                MetricCard(
                    title = "Daily P/L",
                    value = "₹18,640",
                    trend = "+1.2%",
                    positive = true,
                    modifier = Modifier.weight(1f)
                )
                MetricCard(
                    title = "Win Rate",
                    value = "68%",
                    trend = "+4.1%",
                    positive = true,
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(18.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Card(
                    modifier = Modifier.weight(1.5f),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF102230)),
                    shape = RoundedCornerShape(18.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Text("Market Overview", color = TextPrimary, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(18.dp))
                        PriceRow("NIFTY 50", "24680.25", "+120.5")
                        PriceRow("BANK NIFTY", "52410.8", "+210.7")
                        PriceRow("SBIN", "846.90", "+12.4")
                    }
                }

                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF102230)),
                    shape = RoundedCornerShape(18.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Text("AI Signal", color = TextPrimary, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(12.dp))
                        SignalBadge("Bullish Trend", true)
                        Spacer(modifier = Modifier.height(10.dp))
                        Text("Confidence: 84%", color = TextSecondary)
                        Text("Setup: Breakout + Volume Confirmation", color = TextSecondary)
                        Spacer(modifier = Modifier.height(12.dp))
                        Text("Recommended action: Entry near 846.90 with ladder buy plan.", color = TextPrimary)
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF102230)),
                    shape = RoundedCornerShape(18.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Text("Strategy Ladder", color = TextPrimary, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(12.dp))
                        state.strategyLevels.forEach { level ->
                            StrategyRow(level)
                        }
                    }
                }

                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF102230)),
                    shape = RoundedCornerShape(18.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Text("Risk Controls", color = TextPrimary, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(12.dp))
                        RiskRow("Max Daily Loss", "₹25,000")
                        RiskRow("Max Exposure", "₹1,50,000")
                        RiskRow("Open Positions", "3")
                        RiskRow("Trailing SL", "1.2%")
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF102230)),
                shape = RoundedCornerShape(18.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text("Recent Trades", color = TextPrimary, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(10.dp))
                    LazyColumn(modifier = Modifier.height(180.dp)) {
                        items(state.trades) { trade ->
                            TradeRow(trade)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TopBar() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = "AI Trader",
            fontSize = 26.sp,
            fontWeight = FontWeight.ExtraBold,
            color = TextPrimary
        )

        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            StatusPill("Connected", true)
            Button(
                onClick = {},
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1D3557))
            ) {
                Text("Live")
            }
        }
    }
}

@Composable
fun StatusPill(label: String, live: Boolean) {
    Surface(
        color = if (live) Green.copy(alpha = 0.18f) else Color(0xFF3D3F46),
        shape = RoundedCornerShape(20.dp)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .background(if (live) Green else Red, shape = RoundedCornerShape(50))
            )
            Text(label, color = TextPrimary, fontSize = 12.sp)
        }
    }
}

@Composable
fun MetricCard(title: String, value: String, trend: String, positive: Boolean, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = Color(0xFF102230)),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(Modifier.padding(16.dp)) {
            Text(title, color = TextSecondary, fontSize = 12.sp)
            Spacer(modifier = Modifier.height(6.dp))
            Text(value, color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 22.sp)
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                trend,
                color = if (positive) Green else Red,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}

@Composable
fun PriceRow(symbol: String, price: String, change: String) {
    Row(
        Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(symbol, color = TextPrimary)
        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(price, color = TextPrimary)
            Text(change, color = Green, fontWeight = FontWeight.Bold)
        }
    }
    Spacer(modifier = Modifier.height(8.dp))
}

@Composable
fun SignalBadge(label: String, positive: Boolean) {
    Surface(
        color = if (positive) Green.copy(alpha = 0.15f) else Red.copy(alpha = 0.15f),
        shape = RoundedCornerShape(12.dp)
    ) {
        Text(
            text = label,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
            color = if (positive) Green else Red,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
fun StrategyRow(level: StrategyLevel) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text("L${level.level}", color = TextSecondary)
        Text("${level.side} ${formatPrice(level.entry)}", color = TextPrimary)
        Text("Qty ${level.qty}", color = TextSecondary)
        Text("TP ${formatPrice(level.tp)}", color = Green)
    }
}

@Composable
fun RiskRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, color = TextSecondary)
        Text(value, color = TextPrimary, fontWeight = FontWeight.SemiBold)
    }
    Spacer(modifier = Modifier.height(8.dp))
}

@Composable
fun TradeRow(trade: TradeRecord) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(trade.symbol, color = TextPrimary, fontWeight = FontWeight.Bold)
            Text(trade.time, color = TextSecondary, fontSize = 12.sp)
        }

        Text(
            trade.result,
            color = if (trade.result.startsWith("+")) Green else Red,
            fontWeight = FontWeight.Bold
        )
    }
}

private fun formatPrice(value: Double): String {
    return DecimalFormat("0.00").format(value)
}
