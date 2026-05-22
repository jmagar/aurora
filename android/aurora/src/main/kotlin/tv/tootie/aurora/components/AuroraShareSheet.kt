package tv.tootie.aurora.components

import android.content.Context
import android.content.Intent

/**
 * Triggers Android's native share sheet.
 * Maps to web `share-dialog`. Call from a click handler — not a Composable.
 *
 * @param text the text or URL to share.
 * @param subject optional subject line (used by email clients).
 * @param chooserTitle title shown in the share chooser dialog.
 */
public fun shareText(
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
