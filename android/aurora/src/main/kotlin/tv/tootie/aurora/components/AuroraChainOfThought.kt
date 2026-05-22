package tv.tootie.aurora.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Collapsible chain-of-thought reasoning trace.
 *
 * Maps to web AI `chain-of-thought` element.
 *
 * Accessibility:
 * - The header row is a `Role.Button` with `stateDescription` announcing
 *   "expanded" or "collapsed" so TalkBack users know the toggle state.
 * - The chevron icon is decorative (state is carried by `stateDescription`).
 * - Each step carries a `contentDescription` of the form "Step N of M: …"
 *   so screen-reader users hear the full ordinal context.
 * - The step content column is a `Polite` live region so streaming updates
 *   are announced without interrupting the user.
 */
@Composable
public fun AuroraChainOfThought(
    steps: ImmutableList<String>,
    modifier: Modifier = Modifier,
    title: String = "Chain of thought",
    initiallyExpanded: Boolean = false,
) {
    val aurora = LocalAuroraColors.current
    var expanded by remember { mutableStateOf(initiallyExpanded) }
    val stepCount = steps.size

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, aurora.accentVioletBorder, RoundedCornerShape(8.dp)),
        shape = RoundedCornerShape(8.dp),
        color = aurora.accentVioletSurface,
    ) {
        Column {
            // ── Collapse / expand trigger ──────────────────────────────────
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .semantics {
                        role = Role.Button
                        stateDescription = if (expanded) "expanded" else "collapsed"
                    }
                    .clickable(
                        onClickLabel = if (expanded) "Collapse $title" else "Expand $title",
                    ) { expanded = !expanded }
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.labelMedium,
                    color = aurora.accentViolet,
                )
                // Chevron is decorative — state is announced via stateDescription above.
                Icon(
                    imageVector = if (expanded) Icons.Default.KeyboardArrowUp
                                  else Icons.Default.KeyboardArrowDown,
                    contentDescription = null,
                    tint = aurora.accentViolet,
                )
            }

            // ── Step list ──────────────────────────────────────────────────
            AnimatedVisibility(
                visible = expanded,
                enter = expandVertically(),
                exit = shrinkVertically(),
            ) {
                Column(
                    modifier = Modifier
                        .padding(12.dp)
                        .semantics { liveRegion = LiveRegionMode.Polite },
                    verticalArrangement = Arrangement.spacedBy(6.dp),
                ) {
                    steps.forEachIndexed { i, step ->
                        Row(
                            modifier = Modifier.semantics(mergeDescendants = true) {
                                contentDescription = "Step ${i + 1} of $stepCount: $step"
                            },
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                        ) {
                            // Visual step number — suppressed; ordinal is in contentDescription.
                            Text(
                                text = "${i + 1}.",
                                style = MaterialTheme.typography.labelSmall,
                                color = aurora.accentViolet,
                                modifier = Modifier.clearAndSetSemantics { },
                            )
                            Text(
                                text = step,
                                style = MaterialTheme.typography.bodySmall,
                            )
                        }
                    }
                }
            }
        }
    }
}
