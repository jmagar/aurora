package tv.tootie.aurora.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList
import tv.tootie.aurora.theme.LocalAuroraColors

public data class AuroraCommand(
    val label: String,
    val description: String? = null,
    val shortcut: String? = null,
    val onExecute: () -> Unit,
)

/**
 * Searchable command palette modal. Maps to web `command-palette`.
 *
 * The search field is auto-focused when the sheet opens via [FocusRequester] +
 * [LaunchedEffect]. Results use `key { label }` — callers must ensure unique
 * labels on [AuroraCommand]. An empty-state message is announced to TalkBack
 * via `semantics { liveRegion = LiveRegionMode.Polite }`.
 *
 * References [AuroraKbd] from the same package for keyboard shortcut rendering.
 *
 * @param commands    Full command list. Use [ImmutableList] for Compose stability.
 * @param onDismiss   Called when the sheet is dismissed.
 * @param modifier    Applied to the [ModalBottomSheet].
 * @param placeholder Placeholder text for the search field.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
public fun AuroraCommandPalette(
    commands: ImmutableList<AuroraCommand>,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Search commands…",
) {
    val aurora = LocalAuroraColors.current
    var query by remember { mutableStateOf("") }
    val filtered = remember(query, commands) {
        if (query.isBlank()) commands
        else commands.filter {
            it.label.contains(query, ignoreCase = true) ||
            it.description?.contains(query, ignoreCase = true) == true
        }
    }

    // Auto-focus the search field when the sheet first opens
    val focusRequester = remember { FocusRequester() }
    LaunchedEffect(Unit) {
        focusRequester.requestFocus()
    }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true),
        modifier = modifier,
    ) {
        Column(modifier = Modifier.padding(bottom = 16.dp)) {
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                placeholder = { Text(placeholder) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
                    .focusRequester(focusRequester),
                singleLine = true,
            )
            HorizontalDivider(color = aurora.borderDefault)

            if (filtered.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp)
                        .semantics { liveRegion = LiveRegionMode.Polite },
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text = if (query.isBlank()) "No commands available"
                               else "No commands match \"$query\"",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            } else {
                LazyColumn {
                    // key = label — callers must ensure unique labels on AuroraCommand
                    items(filtered, key = { it.label }) { cmd ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable(role = Role.Button) { cmd.onExecute(); onDismiss() }
                                .padding(horizontal = 16.dp, vertical = 12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(cmd.label, style = MaterialTheme.typography.bodyMedium)
                                cmd.description?.let {
                                    Text(
                                        it,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    )
                                }
                            }
                            cmd.shortcut?.let {
                                AuroraKbd(key = it, contentDescription = it)
                            }
                        }
                    }
                }
            }
        }
    }
}
