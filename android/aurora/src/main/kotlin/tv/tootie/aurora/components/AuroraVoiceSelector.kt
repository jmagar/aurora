package tv.tootie.aurora.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * TTS voice picker. Delegates to AuroraModelSelector with voice icon.
 * Maps to web AI `voice-selector` element.
 */
@Composable
public fun AuroraVoiceSelector(
    voices: List<AuroraComboboxOption>,
    selected: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    AuroraModelSelector(
        models = voices,
        selected = selected,
        onSelect = onSelect,
        modifier = modifier,
    )
}
