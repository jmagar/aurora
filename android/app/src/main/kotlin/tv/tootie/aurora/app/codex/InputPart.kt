package tv.tootie.aurora.app.codex

/**
 * Attachment that is pending in the UI before the user hits Send.
 * [displayName] is the filename or "Photo" shown in the chip.
 * [mimeType] is used to build the data URL prefix for the Codex `image` input part.
 * [base64Data] is the raw base64-encoded image bytes (no newlines, no prefix).
 *
 * Serialised in `turn/start` input as:
 *   {"type":"image","url":"data:image/jpeg;base64,...","detail":"auto"}
 */
data class PendingAttachment(
    val id: String,
    val displayName: String,
    val mimeType: String,        // e.g. "image/jpeg"
    val base64Data: String,
)
