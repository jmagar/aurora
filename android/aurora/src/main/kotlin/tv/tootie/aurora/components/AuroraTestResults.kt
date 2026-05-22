package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Cancel
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public data class AuroraTestResult(val name: String, val passed: Boolean, val message: String? = null)

/**
 * Test suite results list. Maps to web AI `test-results` element.
 */
@Composable
public fun AuroraTestResults(
    results: List<AuroraTestResult>,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current
    val passed = results.count { it.passed }
    val total = results.size
    val allPassed = passed == total

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .border(
                1.dp,
                if (allPassed) aurora.successBorder else aurora.errorBorder,
                RoundedCornerShape(8.dp),
            ),
        shape = RoundedCornerShape(8.dp),
        color = if (allPassed) aurora.successSurface else aurora.errorSurface,
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            Text(
                "$passed / $total passed",
                style = MaterialTheme.typography.labelMedium,
                color = if (allPassed) aurora.success else aurora.error,
            )
            results.forEach { result ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Icon(
                        if (result.passed) Icons.Default.CheckCircle else Icons.Default.Cancel,
                        contentDescription = if (result.passed) "Pass" else "Fail",
                        tint = if (result.passed) aurora.success else aurora.error,
                    )
                    Column(modifier = Modifier.weight(1f)) {
                        Text(result.name, style = MaterialTheme.typography.bodySmall)
                        result.message?.let {
                            Text(
                                it,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                }
            }
        }
    }
}
