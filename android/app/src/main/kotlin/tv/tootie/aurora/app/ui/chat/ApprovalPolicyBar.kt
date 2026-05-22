package tv.tootie.aurora.app.ui.chat

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.SupervisorAccount
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
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.app.codex.ApprovalPolicy
import tv.tootie.aurora.app.codex.ApprovalsReviewer
import tv.tootie.aurora.app.codex.GranularPolicy
import tv.tootie.aurora.components.AuroraDropdownMenu
import tv.tootie.aurora.components.AuroraMenuEntry
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
            AuroraDropdownMenu(
                entries = ApprovalPolicy.entries.map { policy ->
                    AuroraMenuEntry.Item(
                        label = policy.displayName,
                        onClick = { onPolicySelect(policy) },
                    )
                },
                expanded = policyMenuOpen,
                onDismissRequest = { policyMenuOpen = false },
                anchor = {
                    Row(
                        modifier = Modifier
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
                },
            )

            // Reviewer selector
            AuroraDropdownMenu(
                entries = ApprovalsReviewer.entries.map { reviewer ->
                    AuroraMenuEntry.Item(
                        label = reviewer.displayName,
                        onClick = { onReviewerSelect(reviewer) },
                    )
                },
                expanded = reviewerMenuOpen,
                onDismissRequest = { reviewerMenuOpen = false },
                anchor = {
                    Row(
                        modifier = Modifier
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
                },
            )
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
                    label = "MCP Elicitations",
                    checked = granularPolicy.mcpElicitations,
                    onCheckedChange = { v -> onGranularUpdate { copy(mcpElicitations = v) } },
                )
                GranularSwitchRow(
                    label = "Sandbox Commands",
                    checked = granularPolicy.sandboxApproval,
                    onCheckedChange = { v -> onGranularUpdate { copy(sandboxApproval = v) } },
                )
                GranularSwitchRow(
                    label = "Rules",
                    checked = granularPolicy.rules,
                    onCheckedChange = { v -> onGranularUpdate { copy(rules = v) } },
                )
                GranularSwitchRow(
                    label = "Skill Invocations",
                    checked = granularPolicy.skillApproval,
                    onCheckedChange = { v -> onGranularUpdate { copy(skillApproval = v) } },
                )
            }
        }
    }
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
