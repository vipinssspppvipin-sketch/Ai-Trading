package com.trading.ai.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val SurfaceDark = Color(0xFF07141D)
val PanelDark = Color(0xFF102230)
val Green = Color(0xFF2AD19D)
val Red = Color(0xFFFF6886)
val Orange = Color(0xFFFFB74D)
val TextPrimary = Color(0xFFEAF4FF)
val TextSecondary = Color(0xFF9BB4C8)

private val DarkColorScheme = darkColorScheme(
    primary = Green,
    secondary = Orange,
    background = SurfaceDark,
    surface = PanelDark,
    onPrimary = Color.Black,
    onSecondary = Color.Black,
    onBackground = TextPrimary,
    onSurface = TextPrimary
)

@Composable
fun AITradingTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
