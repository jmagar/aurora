package tv.tootie.aurora.app.ui.chat

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.SupervisorAccount
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.app.codex.ApprovalPolicy
import tv.tootie.aurora.app.codex.ApprovalsReviewer
import tv.tootie.aurora.app.codex.GranularPolicy
import tv.tootie.aurora.components.AuroraSwitch
import tv.tootie.aurora.theme.LocalAuroraColors

@Composable
fun ApprovalPolicyBar(
    selectedPolicy: ApprovalPolicy,
    granularPolicy: GranularPolicy,
    selectedReviewer: ApprovalsReviewer,
    onPolicySelect: (ApprovalPolicy) -> Unit,
    onGranularUpdate: (GranularPolicy.() -> GranularPolicy) -> Unit,
    onReviewerSelect: (ApprovalsReviewer) -> Unit,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current
    var policyMenuOpen by remember { mutableStateOf(false) }
    var reviewerMenuOpen by remember { mutableStateOf(false) }

    Column(modifier = modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 2.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            // Policy selector
            Box {
                Row(
                    modifier = Modifier
                        .semantics {
                            contentDescription = "Approval policy selector"
                            stateDescription = selectedPolicy.displayName
                        }
                        .clickable(role = Role.Button) { policyMenuOpen = true }
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    Icon(
                        Icons.Default.Security,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = aurora.accentViolet,
                    )
                    Text(
                        selectedPolicy.displayName,
                        style = MaterialTheme.typography.labelSmall,
                        color = aurora.accentViolet,
                    )
                    Icon(
                        Icons.Default.ExpandMore,
                        contentDescription = "Change approval policy",
                        modifier = Modifier.size(14.dp),
                        tint = aurora.accentViolet,
                    )
                }
                DropdownMenu(
                    expanded = policyMenuOpen,
                    onDismissRequest = { policyMenuOpen = false },
                ) {
                    ApprovalPolicy.entries.forEach { policy ->
                        DescriptiveMenuItem(
                            label = policy.displayName,
                            description = policy.description,
                            selected = policy == selectedPolicy,
                            accentColor = aurora.accentViolet,
                            onClick = {
                                onPolicySelect(policy)
                                policyMenuOpen = false
                            },
                        )
                    }
                }
            }

            // Reviewer selector
            Box {
                Row(
                    modifier = Modifier
                        .semantics {
                            contentDescription = "Approvals reviewer selector"
                            stateDescription = selectedReviewer.displayName
                        }
                        .clickable(role = Role.Button) { reviewerMenuOpen = true }
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    Icon(
                        Icons.Default.SupervisorAccount,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Text(
                        selectedReviewer.displayName,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Icon(
                        Icons.Default.ExpandMore,
                        contentDescription = "Change approvals reviewer",
                        modifier = Modifier.size(14.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                DropdownMenu(
                    expanded = reviewerMenuOpen,
                    onDismissRequest = { reviewerMenuOpen = false },
                ) {
                    ApprovalsReviewer.entries.forEach { reviewer ->
                        DescriptiveMenuItem(
                            label = reviewer.displayName,
                            description = reviewer.description,
                            selected = reviewer == selectedReviewer,
                            accentColor = aurora.accentViolet,
                            onClick = {
                                onReviewerSelect(reviewer)
                                reviewerMenuOpen = false
                            },
                        )
                    }
                }
            }
        }

        // Granular policy switch group — only shown when policy == Granular
        AnimatedVisibility(visible = selectedPolicy == ApprovalPolicy.Granular) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp),
            ) {
                GranularSwitchRow(
                    label = "MCP elicitations",
                    checked = granularPolicy.mcpElicitations,
                    onCheckedChange = { v -> onGranularUpdate { copy(mcpElicitations = v) } },
                )
                GranularSwitchRow(
                    label = "Sandbox commands",
                    checked = granularPolicy.sandboxApproval,
                    onCheckedChange = { v -> onGranularUpdate { copy(sandboxApproval = v) } },
                )
                GranularSwitchRow(
                    label = "Rules",
                    checked = granularPolicy.rules,
                    onCheckedChange = { v -> onGranularUpdate { copy(rules = v) } },
                )
                GranularSwitchRow(
                    label = "Skill invocations",
                    checked = granularPolicy.skillApproval,
                    onCheckedChange = { v -> onGranularUpdate { copy(skillApproval = v) } },
                )
            }
        }
    }
}

/**
 * Dropdown menu item with a two-line label (title + description) and a
 * checkmark/accent treatment when [selected] is true.
 *
 * Local composable kept here per file-ownership constraints; could be promoted
 * to an Aurora primitive later if reused.
 */
@Composable
private fun DescriptiveMenuItem(
    label: String,
    description: String,
    selected: Boolean,
    accentColor: Color,
    onClick: () -> Unit,
) {
    val titleColor = if (selected) accentColor else MaterialTheme.colorScheme.onSurface
    val subtitleColor = if (selected) accentColor.copy(alpha = 0.75f)
                        else MaterialTheme.colorScheme.onSurfaceVariant

    DropdownMenuItem(
        text = {
            Column {
                Text(
                    label,
                    style = MaterialTheme.typography.bodyMedium,
                    color = titleColor,
                )
                Text(
                    description,
                    style = MaterialTheme.typography.labelSmall,
                    color = subtitleColor,
                )
            }
        },
        onClick = onClick,
        trailingIcon = if (selected) {
            {
                Icon(
                    Icons.Default.Check,
                    contentDescription = "Selected",
                    modifier = Modifier.size(18.dp),
                    tint = accentColor,
                )
            }
        } else null,
    )
}

@Composable
private fun GranularSwitchRow(
    label: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            label,
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        AuroraSwitch(
            checked = checked,
            onCheckedChange = onCheckedChange,
        )
    }
}
