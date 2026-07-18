package tv.tootie.aurora.components

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import tv.tootie.aurora.icons.filled.UploadFile
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics

/**
 * File picker button that opens the system file chooser via [ActivityResultContracts.GetContent].
 * Maps to web `file-picker`.
 *
 * The result launcher is created inside this composable because
 * [rememberLauncherForActivityResult] must be called in a composable scope. The caller receives
 * the result exclusively through [onFilePicked]; no internal state is kept.
 *
 * Requires `androidx.activity:activity-compose` on the calling module's classpath.
 *
 * @param onFilePicked Called with the selected [Uri] after the user confirms selection.
 * @param modifier Caller-supplied modifier applied to the trigger [OutlinedButton].
 * @param label Button label text (also used as the accessibility content description).
 * @param mimeType MIME type filter passed to [ActivityResultContracts.GetContent] (default `*&#47;*`).
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
        modifier = modifier.semantics { contentDescription = label },
    ) {
        Icon(
            imageVector = Icons.Default.UploadFile,
            contentDescription = null, // button label already describes the action
            modifier = Modifier.size(ButtonDefaults.IconSize),
        )
        Spacer(modifier = Modifier.size(ButtonDefaults.IconSpacing))
        Text(label)
    }
}

/**
 * Multi-file picker variant that opens the system file chooser via
 * [ActivityResultContracts.GetMultipleContents].
 *
 * @param onFilesPicked Called with the list of selected [Uri]s (may be empty if user cancels).
 * @param modifier Caller-supplied modifier applied to the trigger [OutlinedButton].
 * @param label Button label text (also used as the accessibility content description).
 * @param mimeType MIME type filter passed to [ActivityResultContracts.GetMultipleContents].
 */
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
        modifier = modifier.semantics { contentDescription = label },
    ) {
        Icon(
            imageVector = Icons.Default.UploadFile,
            contentDescription = null, // button label already describes the action
            modifier = Modifier.size(ButtonDefaults.IconSize),
        )
        Spacer(modifier = Modifier.size(ButtonDefaults.IconSpacing))
        Text(label)
    }
}
