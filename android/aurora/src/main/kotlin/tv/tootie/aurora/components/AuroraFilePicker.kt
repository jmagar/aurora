package tv.tootie.aurora.components

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.UploadFile
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * File picker button that opens the system file chooser.
 * Maps to web `file-picker`. Requires `androidx.activity:activity-compose`.
 */
@Composable
public fun AuroraFilePicker(
    onFilePicked: (Uri) -> Unit,
    modifier: Modifier = Modifier,
    label: String = "Choose file",
    mimeType: String = "*/*",
) {
    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent(),
        onResult = { uri -> uri?.let { onFilePicked(it) } },
    )

    OutlinedButton(
        onClick = { launcher.launch(mimeType) },
        modifier = modifier,
    ) {
        Icon(Icons.Default.UploadFile, contentDescription = null)
        Text(label)
    }
}

/** Multi-file picker variant. */
@Composable
public fun AuroraMultiFilePicker(
    onFilesPicked: (List<Uri>) -> Unit,
    modifier: Modifier = Modifier,
    label: String = "Choose files",
    mimeType: String = "*/*",
) {
    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetMultipleContents(),
        onResult = { uris -> onFilesPicked(uris) },
    )

    OutlinedButton(
        onClick = { launcher.launch(mimeType) },
        modifier = modifier,
    ) {
        Icon(Icons.Default.UploadFile, contentDescription = null)
        Text(label)
    }
}
