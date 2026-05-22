package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Cancel
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.RemoveCircle
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList
import tv.tootie.aurora.theme.LocalAuroraColors

/** Outcome of a single test case. */
public enum class AuroraTestOutcome { Passed, Failed, Skipped }

/**
 * Data model for a single test result row.
 *
 * @property id      Stable unique key used as the [LazyColumn] item key.
 * @property name    Test case name.
 * @property outcome Pass / fail / skip status.
 * @property message Optional failure message or skip reason.
 */
@Immutable
public data class AuroraTestResult(
    val id: String,
    val name: String,
    val outcome: AuroraTestOutcome,
    val message: String? = null,
)

/**
 * Test suite results list. Maps to web AI `test-results` element.
 *
 * Accessibility:
 * - The summary header carries a [contentDescription] in the form
 *   "12 passed, 3 failed, 1 skipped" so TalkBack reads counts atomically.
 * - Individual rows announce "Passed: …", "Failed: …", or "Skipped: …" before the test name.
 * - Icons are decorative — the label is embedded in the row's merged description.
 *
 * @param results Individual test outcomes. Use [ImmutableList] for Compose stability.
 * @param modifier Modifier applied to the outer [Surface].
 */
@Composable
public fun AuroraTestResults(
    results: ImmutableList<AuroraTestResult>,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current
    val passedCount = results.count { it.outcome == AuroraTestOutcome.Passed }
    val failedCount = results.count { it.outcome == AuroraTestOutcome.Failed }
    val skippedCount = results.count { it.outcome == AuroraTestOutcome.Skipped }
    val allPassed = failedCount == 0 && skippedCount == 0 && results.isNotEmpty()

    val summaryDescription = buildString {
        append("$passedCount passed")
        if (failedCount > 0) append(", $failedCount failed")
        if (skippedCount > 0) append(", $skippedCount skipped")
    }

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
            // Summary header — announced as a single string by TalkBack.
            Text(
                text = summaryDescription,
                style = MaterialTheme.typography.labelMedium,
                color = if (allPassed) aurora.success else aurora.error,
                modifier = Modifier.semantics { contentDescription = summaryDescription },
            )

            LazyColumn(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                items(results, key = { it.id }) { result ->
                    val (icon, iconTint, outcomePrefix) = when (result.outcome) {
                        AuroraTestOutcome.Passed  ->
                            Triple(Icons.Default.CheckCircle, aurora.success, "Passed")
                        AuroraTestOutcome.Failed  ->
                            Triple(Icons.Default.Cancel, aurora.error, "Failed")
                        AuroraTestOutcome.Skipped ->
                            Triple(Icons.Default.RemoveCircle, aurora.neutral, "Skipped")
                    }

                    val rowDescription = buildString {
                        append("$outcomePrefix: ${result.name}")
                        result.message?.let { append(", $it") }
                    }

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .semantics(mergeDescendants = true) {
                                contentDescription = rowDescription
                            },
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        // Icon is decorative — outcome is in the merged contentDescription.
                        Icon(
                            imageVector = icon,
                            contentDescription = null,
                            tint = iconTint,
                        )
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = result.name,
                                style = MaterialTheme.typography.bodySmall,
                            )
                            result.message?.let {
                                Text(
                                    text = it,
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
}
