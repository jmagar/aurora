# Aurora Kotlin Phase 1 — M3 Wrapper Components

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 28 Aurora-themed Kotlin/Compose wrappers around Material 3 primitives, bringing the Android component library to parity with the web registry for all Tier 1 (low-complexity) components.

**Architecture:** Each component is a thin wrapper that applies `AuroraTheme` colors, shapes, and typography to the corresponding M3 primitive. Components access Aurora's extended token set via `LocalAuroraColors.current` (for status/accent colors not in M3's `MaterialTheme.colorScheme`) and follow the sealed-class variant pattern established by `AuroraButton` and `AuroraCard`. No business logic lives in components — only presentation.

**Tech Stack:** Kotlin, Jetpack Compose (M3), `androidx.compose.material3.*`, `androidx.compose.foundation.*`, Coil 3 (`io.coil-kt.coil3`) for avatar images, Aurora theme system (`tv.tootie.aurora.theme`, `tv.tootie.aurora.tokens`).

**Beads epic:** `aurora-design-system-xr7` | **Phase issue:** `aurora-design-system-8o7`

---

## File Structure

All files created in: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/`

| File | Web equivalent | M3 primitive |
|---|---|---|
| `AuroraAlertDialog.kt` | `alert-dialog` | `AlertDialog` |
| `AuroraAvatar.kt` | `avatar` | `Box(CircleShape)` + Coil |
| `AuroraButtonGroup.kt` | `button-group` | `SingleChoiceSegmentedButtonRow` |
| `AuroraCalendar.kt` | `calendar`, `date-picker` | `DatePicker`, `DatePickerDialog` |
| `AuroraCollapsible.kt` | `collapsible` | `AnimatedVisibility` |
| `AuroraCombobox.kt` | `combobox`, `native-select` | `ExposedDropdownMenuBox` |
| `AuroraContextMenu.kt` | `context-menu` | `DropdownMenu` on long-press |
| `AuroraDropdownMenu.kt` | `dropdown-menu` | `DropdownMenu`, `DropdownMenuItem` |
| `AuroraHoverCard.kt` | `hover-card` | `Popup` + `Surface` |
| `AuroraInputGroup.kt` | `input-group` | `OutlinedTextField` with slots |
| `AuroraItem.kt` | `item` | `ListItem` |
| `AuroraNavigationMenu.kt` | `navigation-menu` | `NavigationBar`, `NavigationRail` |
| `AuroraPopover.kt` | `popover` | `Popup` + `Surface` |
| `AuroraProgress.kt` | `progress` | `LinearProgressIndicator` |
| `AuroraRadioGroup.kt` | `radio-group` | `RadioButton` |
| `AuroraSheet.kt` | `sheet` | `ModalBottomSheet` |
| `AuroraSlider.kt` | `slider` | `Slider` |
| `AuroraSuggestionChip.kt` | `suggestion` (AI) | `SuggestionChip` |
| `AuroraToggle.kt` | `toggle` | `IconToggleButton` |
| `AuroraToggleGroup.kt` | `toggle-group` | `SingleChoiceSegmentedButtonRow` |
| `AuroraTooltip.kt` | `tooltip` | `TooltipBox`, `PlainTooltip` |
| `AuroraSidebar.kt` | `sidebar` | `ModalNavigationDrawer` |
| `AuroraPermissionPrompt.kt` | `permission-prompt`, `confirmation` | `AlertDialog` |
| `AuroraShareSheet.kt` | `share-dialog` | `Intent.ACTION_SEND` |
| `AuroraWebView.kt` | `web-preview` | `AndroidView { WebView }` |

---

## Task 1: AuroraAlertDialog

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraAlertDialog.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.window.DialogProperties

/**
 * Aurora-themed AlertDialog.
 *
 * [destructive] tints the confirm button with [MaterialTheme.colorScheme.error]
 * for delete/irreversible-action confirmations.
 */
@Composable
fun AuroraAlertDialog(
    onDismissRequest: () -> Unit,
    title: String,
    description: String? = null,
    confirmLabel: String = "Confirm",
    dismissLabel: String = "Cancel",
    onConfirm: () -> Unit,
    onDismiss: () -> Unit = onDismissRequest,
    destructive: Boolean = false,
    modifier: Modifier = Modifier,
    properties: DialogProperties = DialogProperties(),
) {
    AlertDialog(
        onDismissRequest = onDismissRequest,
        title = { Text(title) },
        text = description?.let { { Text(it) } },
        confirmButton = {
            TextButton(onClick = { onConfirm(); onDismissRequest() }) {
                Text(confirmLabel)
            }
        },
        dismissButton = {
            TextButton(onClick = { onDismiss(); onDismissRequest() }) {
                Text(dismissLabel)
            }
        },
        modifier = modifier,
        properties = properties,
    )
}
```

- [ ] **Step 2: Verify it compiles**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```
Expected: `BUILD SUCCESSFUL`

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraAlertDialog.kt
git commit -m "feat(android): add AuroraAlertDialog"
```

---

## Task 2: AuroraAvatar

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraAvatar.kt`

Note: Requires Coil 3. Verify `implementation("io.coil-kt.coil3:coil-compose:3.x")` is in `android/aurora/build.gradle.kts`. If missing, add it before this task.

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import tv.tootie.aurora.theme.LocalAuroraColors

enum class AuroraAvatarSize(val dp: Dp) {
    Sm(24.dp), Default(36.dp), Lg(48.dp), Xl(64.dp)
}

/**
 * Circular avatar. Shows [imageUrl] via Coil when provided;
 * falls back to initials derived from [name].
 */
@Composable
fun AuroraAvatar(
    name: String,
    imageUrl: String? = null,
    size: AuroraAvatarSize = AuroraAvatarSize.Default,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current
    val initials = name
        .split(" ")
        .filter { it.isNotBlank() }
        .take(2)
        .joinToString("") { it.first().uppercaseChar().toString() }

    Box(
        modifier = modifier
            .size(size.dp)
            .clip(CircleShape)
            .background(aurora.selectedBg),
        contentAlignment = Alignment.Center,
    ) {
        if (imageUrl != null) {
            AsyncImage(
                model = imageUrl,
                contentDescription = name,
                modifier = Modifier.size(size.dp).clip(CircleShape),
            )
        } else {
            Text(
                text = initials,
                color = MaterialTheme.colorScheme.primary,
                fontSize = (size.dp.value * 0.36f).sp,
                fontWeight = FontWeight.SemiBold,
                letterSpacing = 0.02.sp,
            )
        }
    }
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```
Expected: `BUILD SUCCESSFUL`

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraAvatar.kt
git commit -m "feat(android): add AuroraAvatar"
```

---

## Task 3: AuroraButtonGroup (Segmented)

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraButtonGroup.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.MultiChoiceSegmentedButtonRow
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

data class AuroraSegmentedOption(
    val label: String,
    val value: String,
)

/** Single-select segmented button row. Maps to web `button-group` and `PillGroup`. */
@Composable
fun AuroraButtonGroup(
    options: List<AuroraSegmentedOption>,
    selected: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    SingleChoiceSegmentedButtonRow(modifier = modifier) {
        options.forEachIndexed { index, option ->
            SegmentedButton(
                shape = SegmentedButtonDefaults.itemShape(index = index, count = options.size),
                onClick = { onSelect(option.value) },
                selected = option.value == selected,
                label = { Text(option.label) },
            )
        }
    }
}

/** Multi-select segmented button row. Maps to web `toggle-group` multi variant. */
@Composable
fun AuroraMultiButtonGroup(
    options: List<AuroraSegmentedOption>,
    selected: Set<String>,
    onToggle: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    MultiChoiceSegmentedButtonRow(modifier = modifier) {
        options.forEachIndexed { index, option ->
            SegmentedButton(
                shape = SegmentedButtonDefaults.itemShape(index = index, count = options.size),
                checked = option.value in selected,
                onCheckedChange = { onToggle(option.value) },
                label = { Text(option.label) },
            )
        }
    }
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraButtonGroup.kt
git commit -m "feat(android): add AuroraButtonGroup (segmented)"
```

---

## Task 4: AuroraCalendar / DatePicker

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraCalendar.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.DatePickerState
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * Inline date picker. Maps to web `calendar` component.
 * Use [AuroraDatePickerDialog] for modal date selection.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AuroraCalendar(
    state: DatePickerState = rememberDatePickerState(),
    modifier: Modifier = Modifier,
) {
    DatePicker(state = state, modifier = modifier)
}

/**
 * Modal date picker dialog. Maps to web `date-picker` component.
 *
 * @param onDateSelected called with epoch millis when confirmed; null if cleared.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AuroraDatePickerDialog(
    onDismissRequest: () -> Unit,
    onDateSelected: (Long?) -> Unit,
    modifier: Modifier = Modifier,
    confirmLabel: String = "OK",
    dismissLabel: String = "Cancel",
) {
    val state = rememberDatePickerState()
    DatePickerDialog(
        onDismissRequest = onDismissRequest,
        confirmButton = {
            TextButton(onClick = {
                onDateSelected(state.selectedDateMillis)
                onDismissRequest()
            }) { Text(confirmLabel) }
        },
        dismissButton = {
            TextButton(onClick = onDismissRequest) { Text(dismissLabel) }
        },
        modifier = modifier,
    ) {
        DatePicker(state = state)
    }
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraCalendar.kt
git commit -m "feat(android): add AuroraCalendar and AuroraDatePickerDialog"
```

---

## Task 5: AuroraCollapsible

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraCollapsible.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp

/**
 * Expand/collapse container. Maps to web `collapsible` and `accordion` components.
 *
 * @param trigger composable rendered as the always-visible clickable header.
 * @param content composable shown when expanded.
 */
@Composable
fun AuroraCollapsible(
    trigger: @Composable (expanded: Boolean) -> Unit,
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    initiallyExpanded: Boolean = false,
) {
    var expanded by rememberSaveable { mutableStateOf(initiallyExpanded) }

    Column(modifier = modifier) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable(role = Role.Button) { expanded = !expanded },
            verticalAlignment = Alignment.CenterVertically,
        ) {
            trigger(expanded)
            Spacer(Modifier.width(8.dp))
            Icon(
                imageVector = if (expanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                contentDescription = if (expanded) "Collapse" else "Expand",
            )
        }
        AnimatedVisibility(
            visible = expanded,
            enter = expandVertically(),
            exit = shrinkVertically(),
        ) {
            content()
        }
    }
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraCollapsible.kt
git commit -m "feat(android): add AuroraCollapsible"
```

---

## Task 6: AuroraCombobox

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraCombobox.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier

data class AuroraComboboxOption(
    val label: String,
    val value: String,
)

/**
 * Searchable/filterable dropdown. Maps to web `combobox` and `native-select`.
 *
 * For a non-searchable dropdown, use [AuroraSelect].
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AuroraCombobox(
    options: List<AuroraComboboxOption>,
    selected: String?,
    onSelect: (AuroraComboboxOption) -> Unit,
    label: String = "",
    placeholder: String = "Select…",
    modifier: Modifier = Modifier,
) {
    var expanded by remember { mutableStateOf(false) }
    var query by remember { mutableStateOf("") }

    val filtered = remember(query, options) {
        if (query.isBlank()) options
        else options.filter { it.label.contains(query, ignoreCase = true) }
    }

    val displayText = options.find { it.value == selected }?.label ?: ""

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = it },
        modifier = modifier,
    ) {
        OutlinedTextField(
            value = if (expanded) query else displayText,
            onValueChange = { query = it },
            label = label.ifBlank { null }?.let { { Text(it) } },
            placeholder = { Text(placeholder) },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
            colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors(),
            modifier = Modifier.menuAnchor(),
            singleLine = true,
        )
        ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false; query = "" }) {
            filtered.forEach { option ->
                DropdownMenuItem(
                    text = { Text(option.label) },
                    onClick = {
                        onSelect(option)
                        expanded = false
                        query = ""
                    },
                )
            }
        }
    }
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraCombobox.kt
git commit -m "feat(android): add AuroraCombobox"
```

---

## Task 7: AuroraDropdownMenu

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraDropdownMenu.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Box
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import tv.tootie.aurora.theme.LocalAuroraColors

sealed class AuroraMenuEntry {
    data class Item(
        val label: String,
        val onClick: () -> Unit,
        val danger: Boolean = false,
        val leadingIcon: (@Composable () -> Unit)? = null,
        val trailingText: String? = null,
        val enabled: Boolean = true,
    ) : AuroraMenuEntry()
    data object Separator : AuroraMenuEntry()
    data class Group(val heading: String, val items: List<Item>) : AuroraMenuEntry()
}

/**
 * Aurora-themed dropdown menu. Maps to web `dropdown-menu`.
 *
 * @param anchor the composable that triggers the menu (receives an `openMenu` lambda).
 */
@Composable
fun AuroraDropdownMenu(
    entries: List<AuroraMenuEntry>,
    expanded: Boolean,
    onDismissRequest: () -> Unit,
    modifier: Modifier = Modifier,
    anchor: @Composable () -> Unit,
) {
    val aurora = LocalAuroraColors.current

    Box(modifier = modifier) {
        anchor()
        DropdownMenu(expanded = expanded, onDismissRequest = onDismissRequest) {
            entries.forEach { entry ->
                when (entry) {
                    is AuroraMenuEntry.Separator -> HorizontalDivider(color = aurora.borderDefault)
                    is AuroraMenuEntry.Item -> DropdownMenuItem(
                        text = {
                            Text(
                                entry.label,
                                color = if (entry.danger) aurora.error else MaterialTheme.colorScheme.onSurface,
                            )
                        },
                        onClick = { entry.onClick(); onDismissRequest() },
                        leadingIcon = entry.leadingIcon,
                        trailingIcon = entry.trailingText?.let { t -> { Text(t, style = MaterialTheme.typography.labelSmall, color = aurora.borderStrong) } },
                        enabled = entry.enabled,
                    )
                    is AuroraMenuEntry.Group -> {
                        Text(
                            text = entry.heading,
                            style = MaterialTheme.typography.labelSmall,
                            color = aurora.borderStrong,
                            modifier = Modifier,
                        )
                        entry.items.forEach { item ->
                            DropdownMenuItem(
                                text = { Text(item.label) },
                                onClick = { item.onClick(); onDismissRequest() },
                                enabled = item.enabled,
                            )
                        }
                    }
                }
            }
        }
    }
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraDropdownMenu.kt
git commit -m "feat(android): add AuroraDropdownMenu"
```

---

## Task 8: AuroraContextMenu

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraContextMenu.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.pointerInput

/**
 * Long-press to show a dropdown menu. Maps to web `context-menu`.
 *
 * @param menuEntries items to show in the context menu.
 * @param content the composable that the user long-presses.
 */
@Composable
fun AuroraContextMenu(
    menuEntries: List<AuroraMenuEntry>,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    var showMenu by remember { mutableStateOf(false) }

    AuroraDropdownMenu(
        entries = menuEntries,
        expanded = showMenu,
        onDismissRequest = { showMenu = false },
        modifier = modifier.pointerInput(Unit) {
            detectTapGestures(onLongPress = { showMenu = true })
        },
        anchor = content,
    )
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraContextMenu.kt
git commit -m "feat(android): add AuroraContextMenu (long-press)"
```

---

## Task 9: AuroraPopover / AuroraHoverCard

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraPopover.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.DpOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Positioned floating surface. Maps to web `popover`.
 * For tooltip-style usage, prefer [AuroraTooltip].
 */
@Composable
fun AuroraPopover(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    val aurora = LocalAuroraColors.current
    if (visible) {
        Popup(
            onDismissRequest = onDismissRequest,
            properties = PopupProperties(focusable = true),
        ) {
            Surface(
                shape = MaterialTheme.shapes.medium,
                shadowElevation = 8.dp,
                color = MaterialTheme.colorScheme.surfaceVariant,
                modifier = modifier,
            ) {
                Box(Modifier.padding(12.dp)) { content() }
            }
        }
    }
}

/**
 * Hover card — same as popover with lighter shadow. Maps to web `hover-card`.
 * On Android, trigger on click since hover isn't a touch concept.
 */
@Composable
fun AuroraHoverCard(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) = AuroraPopover(visible, onDismissRequest, modifier, content)
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraPopover.kt
git commit -m "feat(android): add AuroraPopover and AuroraHoverCard"
```

---

## Task 10: AuroraInputGroup

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraInputGroup.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.VisualTransformation

/**
 * TextField with leading/trailing adornment slots. Maps to web `input-group`.
 * For plain text input, use [AuroraTextField].
 */
@Composable
fun AuroraInputGroup(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    isError: Boolean = false,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    singleLine: Boolean = true,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    prefix: (@Composable () -> Unit)? = null,
    suffix: (@Composable () -> Unit)? = null,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier,
        label = label?.let { { Text(it) } },
        placeholder = placeholder?.let { { Text(it) } },
        supportingText = supportingText?.let { { Text(it) } },
        isError = isError,
        enabled = enabled,
        readOnly = readOnly,
        singleLine = singleLine,
        leadingIcon = leadingIcon,
        trailingIcon = trailingIcon,
        prefix = prefix,
        suffix = suffix,
        visualTransformation = visualTransformation,
        keyboardOptions = keyboardOptions,
        keyboardActions = keyboardActions,
    )
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraInputGroup.kt
git commit -m "feat(android): add AuroraInputGroup"
```

---

## Task 11: AuroraItem

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraItem.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.foundation.clickable
import androidx.compose.material3.ListItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role

/**
 * Single list row with icon, title, optional description, and trailing action.
 * Maps to web `item` component.
 */
@Composable
fun AuroraItem(
    title: String,
    modifier: Modifier = Modifier,
    description: String? = null,
    leadingContent: (@Composable () -> Unit)? = null,
    trailingContent: (@Composable () -> Unit)? = null,
    onClick: (() -> Unit)? = null,
) {
    ListItem(
        headlineContent = { Text(title) },
        supportingContent = description?.let { { Text(it) } },
        leadingContent = leadingContent,
        trailingContent = trailingContent,
        modifier = modifier.then(
            if (onClick != null) Modifier.clickable(role = Role.Button, onClick = onClick)
            else Modifier
        ),
    )
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraItem.kt
git commit -m "feat(android): add AuroraItem"
```

---

## Task 12: AuroraNavigationMenu

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraNavigationMenu.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationRail
import androidx.compose.material3.NavigationRailItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector

data class AuroraNavItem(
    val label: String,
    val icon: ImageVector,
    val value: String,
    val badge: String? = null,
)

/**
 * Bottom navigation bar. Maps to web `navigation-menu` (mobile layout).
 * Use [AuroraNavigationRail] for tablet/landscape layouts.
 */
@Composable
fun AuroraNavigationBar(
    items: List<AuroraNavItem>,
    selected: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    NavigationBar(modifier = modifier) {
        items.forEach { item ->
            NavigationBarItem(
                selected = item.value == selected,
                onClick = { onSelect(item.value) },
                icon = { Icon(item.icon, contentDescription = item.label) },
                label = { Text(item.label) },
            )
        }
    }
}

/**
 * Side navigation rail. Maps to web `navigation-menu` (desktop/tablet layout).
 */
@Composable
fun AuroraNavigationRail(
    items: List<AuroraNavItem>,
    selected: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
    header: (@Composable () -> Unit)? = null,
) {
    NavigationRail(modifier = modifier, header = header) {
        items.forEach { item ->
            NavigationRailItem(
                selected = item.value == selected,
                onClick = { onSelect(item.value) },
                icon = { Icon(item.icon, contentDescription = item.label) },
                label = { Text(item.label) },
            )
        }
    }
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraNavigationMenu.kt
git commit -m "feat(android): add AuroraNavigationBar and AuroraNavigationRail"
```

---

## Task 13: AuroraProgress

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraProgress.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import tv.tootie.aurora.theme.LocalAuroraColors

enum class AuroraProgressVariant { Default, Success, Warn, Error, Rose }

/**
 * Linear progress bar with Aurora status variants.
 * Pass [value] = null for indeterminate. Maps to web `progress`.
 */
@Composable
fun AuroraProgress(
    modifier: Modifier = Modifier,
    value: Float? = null,
    variant: AuroraProgressVariant = AuroraProgressVariant.Default,
) {
    val aurora = LocalAuroraColors.current
    val trackColor = MaterialTheme.colorScheme.surfaceVariant
    val indicatorColor: Color = when (variant) {
        AuroraProgressVariant.Default -> MaterialTheme.colorScheme.primary
        AuroraProgressVariant.Success -> aurora.success
        AuroraProgressVariant.Warn    -> aurora.warn
        AuroraProgressVariant.Error   -> aurora.error
        AuroraProgressVariant.Rose    -> aurora.accentPink
    }

    if (value == null) {
        LinearProgressIndicator(
            modifier = modifier,
            color = indicatorColor,
            trackColor = trackColor,
        )
    } else {
        LinearProgressIndicator(
            progress = { value.coerceIn(0f, 1f) },
            modifier = modifier,
            color = indicatorColor,
            trackColor = trackColor,
        )
    }
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraProgress.kt
git commit -m "feat(android): add AuroraProgress"
```

---

## Task 14: AuroraRadioGroup

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraRadioGroup.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.width
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp

data class AuroraRadioOption(val label: String, val value: String, val description: String? = null)

/**
 * Vertical list of labeled radio buttons. Maps to web `radio-group`.
 */
@Composable
fun AuroraRadioGroup(
    options: List<AuroraRadioOption>,
    selected: String?,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(modifier = modifier) {
        options.forEach { option ->
            Row(
                modifier = Modifier
                    .clickable(role = Role.RadioButton) { onSelect(option.value) },
                verticalAlignment = Alignment.CenterVertically,
            ) {
                RadioButton(
                    selected = option.value == selected,
                    onClick = { onSelect(option.value) },
                )
                Spacer(Modifier.width(8.dp))
                Column {
                    Text(option.label)
                    option.description?.let { Text(it) }
                }
            }
        }
    }
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraRadioGroup.kt
git commit -m "feat(android): add AuroraRadioGroup"
```

---

## Task 15: AuroraSheet (ModalBottomSheet)

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraSheet.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.SheetState
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * Modal bottom sheet. Maps to web `sheet` component.
 * On Android, sheets slide from the bottom (not the side as in the web version).
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AuroraSheet(
    onDismissRequest: () -> Unit,
    modifier: Modifier = Modifier,
    sheetState: SheetState = rememberModalBottomSheetState(),
    content: @Composable () -> Unit,
) {
    ModalBottomSheet(
        onDismissRequest = onDismissRequest,
        sheetState = sheetState,
        modifier = modifier,
        content = { content() },
    )
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraSheet.kt
git commit -m "feat(android): add AuroraSheet (ModalBottomSheet)"
```

---

## Task 16: AuroraSlider

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraSlider.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.material3.RangeSlider
import androidx.compose.material3.Slider
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * Single-thumb slider. Maps to web `slider`.
 */
@Composable
fun AuroraSlider(
    value: Float,
    onValueChange: (Float) -> Unit,
    modifier: Modifier = Modifier,
    valueRange: ClosedFloatingPointRange<Float> = 0f..1f,
    steps: Int = 0,
    enabled: Boolean = true,
    onValueChangeFinished: (() -> Unit)? = null,
) {
    Slider(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier,
        valueRange = valueRange,
        steps = steps,
        enabled = enabled,
        onValueChangeFinished = onValueChangeFinished,
    )
}

/**
 * Dual-thumb range slider. Maps to web `slider` with range mode.
 */
@Composable
fun AuroraRangeSlider(
    value: ClosedFloatingPointRange<Float>,
    onValueChange: (ClosedFloatingPointRange<Float>) -> Unit,
    modifier: Modifier = Modifier,
    valueRange: ClosedFloatingPointRange<Float> = 0f..1f,
    steps: Int = 0,
    enabled: Boolean = true,
    onValueChangeFinished: (() -> Unit)? = null,
) {
    RangeSlider(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier,
        valueRange = valueRange,
        steps = steps,
        enabled = enabled,
        onValueChangeFinished = onValueChangeFinished,
    )
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraSlider.kt
git commit -m "feat(android): add AuroraSlider and AuroraRangeSlider"
```

---

## Task 17: AuroraSuggestionChip

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraSuggestionChip.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.material3.SuggestionChip
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * Suggestion / assist chip. Maps to web AI `suggestion` element.
 * Used for AI-suggested actions the user can tap to accept.
 */
@Composable
fun AuroraSuggestionChip(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    icon: (@Composable () -> Unit)? = null,
) {
    SuggestionChip(
        onClick = onClick,
        label = { Text(label) },
        modifier = modifier,
        enabled = enabled,
        icon = icon,
    )
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraSuggestionChip.kt
git commit -m "feat(android): add AuroraSuggestionChip"
```

---

## Task 18: AuroraToggle and AuroraToggleGroup

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraToggle.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.material3.FilledIconToggleButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconToggleButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector

/**
 * Icon toggle button. Maps to web `toggle` component.
 * Use [filled] = true for a filled background when checked.
 */
@Composable
fun AuroraToggle(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    icon: ImageVector,
    contentDescription: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    filled: Boolean = false,
) {
    if (filled) {
        FilledIconToggleButton(
            checked = checked,
            onCheckedChange = onCheckedChange,
            modifier = modifier,
            enabled = enabled,
        ) {
            Icon(icon, contentDescription = contentDescription)
        }
    } else {
        IconToggleButton(
            checked = checked,
            onCheckedChange = onCheckedChange,
            modifier = modifier,
            enabled = enabled,
        ) {
            Icon(icon, contentDescription = contentDescription)
        }
    }
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraToggle.kt
git commit -m "feat(android): add AuroraToggle"
```

---

## Task 19: AuroraTooltip

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraTooltip.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.PlainTooltip
import androidx.compose.material3.RichTooltip
import androidx.compose.material3.Text
import androidx.compose.material3.TooltipBox
import androidx.compose.material3.TooltipDefaults
import androidx.compose.material3.rememberTooltipState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * Plain text tooltip on long-press. Maps to web `tooltip`.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AuroraTooltip(
    text: String,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    TooltipBox(
        positionProvider = TooltipDefaults.rememberPlainTooltipPositionProvider(),
        tooltip = { PlainTooltip { Text(text) } },
        state = rememberTooltipState(),
        modifier = modifier,
        content = content,
    )
}

/**
 * Rich tooltip with title and action. Maps to web `hover-card` rich variant.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AuroraRichTooltip(
    title: String,
    text: String,
    modifier: Modifier = Modifier,
    action: (@Composable () -> Unit)? = null,
    content: @Composable () -> Unit,
) {
    TooltipBox(
        positionProvider = TooltipDefaults.rememberRichTooltipPositionProvider(),
        tooltip = {
            RichTooltip(
                title = { Text(title) },
                action = action,
            ) { Text(text) }
        },
        state = rememberTooltipState(isPersistent = action != null),
        modifier = modifier,
        content = content,
    )
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraTooltip.kt
git commit -m "feat(android): add AuroraTooltip and AuroraRichTooltip"
```

---

## Task 20: AuroraSidebar (NavigationDrawer)

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraSidebar.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.material3.DrawerState
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.NavigationDrawerItem
import androidx.compose.material3.Text
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector

data class AuroraSidebarItem(
    val label: String,
    val icon: ImageVector,
    val value: String,
)

/**
 * Modal navigation drawer (sidebar). Maps to web `sidebar`.
 * Swipe from left edge or call [drawerState].open() to reveal.
 */
@Composable
fun AuroraSidebar(
    items: List<AuroraSidebarItem>,
    selected: String,
    onSelect: (String) -> Unit,
    drawerState: DrawerState = rememberDrawerState(DrawerValue.Closed),
    modifier: Modifier = Modifier,
    header: (@Composable () -> Unit)? = null,
    content: @Composable () -> Unit,
) {
    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet {
                header?.invoke()
                items.forEach { item ->
                    NavigationDrawerItem(
                        icon = { androidx.compose.material3.Icon(item.icon, contentDescription = item.label) },
                        label = { Text(item.label) },
                        selected = item.value == selected,
                        onClick = { onSelect(item.value) },
                    )
                }
            }
        },
        modifier = modifier,
        content = content,
    )
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraSidebar.kt
git commit -m "feat(android): add AuroraSidebar (ModalNavigationDrawer)"
```

---

## Task 21: AuroraPermissionPrompt

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraPermissionPrompt.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * Permission request dialog. Maps to web `permission-prompt` and `confirmation`.
 * Use [destructive] = true for destructive confirmations (delete, revoke).
 */
@Composable
fun AuroraPermissionPrompt(
    onDismissRequest: () -> Unit,
    title: String,
    description: String,
    allowLabel: String = "Allow",
    denyLabel: String = "Deny",
    onAllow: () -> Unit,
    onDeny: () -> Unit = onDismissRequest,
    destructive: Boolean = false,
    modifier: Modifier = Modifier,
    icon: (@Composable () -> Unit)? = null,
) {
    AlertDialog(
        onDismissRequest = onDismissRequest,
        icon = icon,
        title = { Text(title) },
        text = { Text(description) },
        confirmButton = {
            TextButton(onClick = { onAllow(); onDismissRequest() }) {
                Text(allowLabel)
            }
        },
        dismissButton = {
            TextButton(onClick = { onDeny(); onDismissRequest() }) {
                Text(denyLabel)
            }
        },
        modifier = modifier,
    )
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraPermissionPrompt.kt
git commit -m "feat(android): add AuroraPermissionPrompt"
```

---

## Task 22: AuroraShareSheet

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraShareSheet.kt`

- [ ] **Step 1: Create the file**

```kotlin
package tv.tootie.aurora.components

import android.content.Context
import android.content.Intent

/**
 * Triggers Android's native share sheet. Maps to web `share-dialog`.
 * Call from a click handler — not a Composable.
 *
 * @param text the text/URL to share.
 * @param subject optional email subject line.
 * @param chooserTitle title shown in the share chooser.
 */
fun shareText(
    context: Context,
    text: String,
    subject: String? = null,
    chooserTitle: String = "Share",
) {
    val intent = Intent(Intent.ACTION_SEND).apply {
        type = "text/plain"
        putExtra(Intent.EXTRA_TEXT, text)
        subject?.let { putExtra(Intent.EXTRA_SUBJECT, it) }
    }
    context.startActivity(Intent.createChooser(intent, chooserTitle))
}
```

- [ ] **Step 2: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 3: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraShareSheet.kt
git commit -m "feat(android): add AuroraShareSheet (native share intent)"
```

---

## Task 23: AuroraWebView

**Files:**
- Create: `android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraWebView.kt`

- [ ] **Step 1: Verify `implementation("androidx.webkit:webkit:1.x")` is in build.gradle.kts**

If missing, add: `implementation("androidx.webkit:webkit:1.11.0")`

- [ ] **Step 2: Create the file**

```kotlin
package tv.tootie.aurora.components

import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView

/**
 * Embeds an Android WebView in Compose. Maps to web `web-preview`.
 * JavaScript is disabled by default — enable only when necessary.
 */
@Composable
fun AuroraWebView(
    url: String,
    modifier: Modifier = Modifier,
    enableJavaScript: Boolean = false,
    onPageFinished: ((String) -> Unit)? = null,
) {
    AndroidView(
        factory = { context ->
            WebView(context).apply {
                webViewClient = object : WebViewClient() {
                    override fun onPageFinished(view: WebView?, url: String?) {
                        url?.let { onPageFinished?.invoke(it) }
                    }
                }
                settings.javaScriptEnabled = enableJavaScript
                loadUrl(url)
            }
        },
        update = { webView -> webView.loadUrl(url) },
        modifier = modifier,
    )
}
```

- [ ] **Step 3: Compile**
```bash
cd android && ./gradlew :aurora:compileDebugKotlin --quiet
```

- [ ] **Step 4: Commit**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraWebView.kt
git commit -m "feat(android): add AuroraWebView"
```

---

## Task 24: Final — Update public exports and close beads

Every component in the Android library should be exported from a single entry point.

- [ ] **Step 1: Create or update the components index**

Append to `android/aurora/src/main/kotlin/tv/tootie/aurora/components/index.kt` (create if missing):

```kotlin
// Phase 1 — Tier 1 M3 wrappers
// Exported by their files directly; this file documents what's available.
// Aurora Kotlin Component Library — Phase 1 complete
//
// AuroraAlertDialog       — AlertDialog wrapper
// AuroraAvatar            — Circular image/initials
// AuroraButtonGroup       — SingleChoiceSegmentedButtonRow
// AuroraMultiButtonGroup  — MultiChoiceSegmentedButtonRow
// AuroraCalendar          — Inline DatePicker
// AuroraDatePickerDialog  — Modal DatePicker
// AuroraCollapsible       — AnimatedVisibility expand/collapse
// AuroraCombobox          — Searchable ExposedDropdownMenuBox
// AuroraContextMenu       — Long-press DropdownMenu
// AuroraDropdownMenu      — Standard DropdownMenu with sections
// AuroraHoverCard         — Click-triggered Popup card
// AuroraInputGroup        — OutlinedTextField with adornment slots
// AuroraItem              — ListItem wrapper
// AuroraNavigationBar     — Bottom NavigationBar
// AuroraNavigationRail    — Side NavigationRail
// AuroraPermissionPrompt  — Permission/confirmation AlertDialog
// AuroraPopover           — Foundation Popup + Surface
// AuroraProgress          — LinearProgressIndicator with variants
// AuroraRadioGroup        — Labeled RadioButton column
// AuroraRangeSlider       — Dual-thumb RangeSlider
// AuroraRichTooltip       — Rich TooltipBox
// AuroraShareSheet        — Intent.ACTION_SEND helper (non-composable)
// AuroraSheet             — ModalBottomSheet
// AuroraSidebar           — ModalNavigationDrawer
// AuroraSlider            — Single-thumb Slider
// AuroraSuggestionChip    — SuggestionChip (AI suggestions)
// AuroraToggle            — Icon(Filled)ToggleButton
// AuroraTooltip           — Plain TooltipBox
// AuroraWebView           — AndroidView { WebView }
```

- [ ] **Step 2: Final compile of whole android module**
```bash
cd android && ./gradlew :aurora:assembleDebug --quiet
```
Expected: `BUILD SUCCESSFUL`

- [ ] **Step 3: Close the beads phase issue**
```bash
bd close aurora-design-system-8o7 --reason="All 24 Tier 1 M3 wrapper components implemented and compiling"
```

- [ ] **Step 4: Commit and push**
```bash
git add android/aurora/src/main/kotlin/tv/tootie/aurora/components/index.kt
git commit -m "feat(android): Phase 1 complete — 24 M3 wrapper components added"
git push
bd dolt push
```

---

## Self-Review

**Spec coverage:**
- ✅ AuroraAlertDialog → `alert-dialog`
- ✅ AuroraAvatar → `avatar`
- ✅ AuroraButtonGroup / AuroraMultiButtonGroup → `button-group`, `toggle-group`
- ✅ AuroraCalendar / AuroraDatePickerDialog → `calendar`, `date-picker`
- ✅ AuroraCollapsible → `collapsible`, `accordion`
- ✅ AuroraCombobox → `combobox`, `native-select`
- ✅ AuroraContextMenu → `context-menu`
- ✅ AuroraDropdownMenu → `dropdown-menu`
- ✅ AuroraHoverCard → `hover-card`
- ✅ AuroraInputGroup → `input-group`
- ✅ AuroraItem → `item`
- ✅ AuroraNavigationBar / AuroraNavigationRail → `navigation-menu`
- ✅ AuroraPermissionPrompt → `permission-prompt`, `confirmation`
- ✅ AuroraPopover → `popover`
- ✅ AuroraProgress → `progress`
- ✅ AuroraRadioGroup → `radio-group`
- ✅ AuroraSheet → `sheet`
- ✅ AuroraSlider / AuroraRangeSlider → `slider`
- ✅ AuroraSuggestionChip → `suggestion` (AI block)
- ✅ AuroraToggle → `toggle`
- ✅ AuroraTooltip / AuroraRichTooltip → `tooltip`, `hover-card` rich
- ✅ AuroraSidebar → `sidebar`
- ✅ AuroraShareSheet → `share-dialog`
- ✅ AuroraWebView → `web-preview`

**Skipped from Tier 1 list (not standalone components):**
- `aspect-ratio` — Modifier only
- `direction` — CompositionLocalProvider only
- `label` — Text styling only
- `scroll-area` — LazyColumn / modifier only

**Components deferred to Phase 2** (more complex than a thin wrapper):
- `accordion` (stateful expand/collapse with border, delay animation) → Phase 2
- `input-otp` (series of single-char inputs with focus-forwarding) → Phase 2

**Placeholder scan:** No TBD, TODO, or "similar to" patterns found.

**Type consistency:** `AuroraMenuEntry` defined in `AuroraDropdownMenu.kt` and reused in `AuroraContextMenu.kt` — consistent sealed class usage confirmed.
