package tv.tootie.aurora.app.codex

/** Structured item produced when the user confirms a @mention or /command selection. */
sealed class SelectedItem {
    /** A skill invocation — maps to UserInput {type:"skill", name, path} */
    data class Skill(val name: String, val path: String) : SelectedItem()
    /** A @mention — maps to UserInput {type:"mention", name, path} */
    data class Mention(val name: String, val path: String) : SelectedItem()
    /** A /slash-command — maps to UserInput {type:"command", name, path} */
    data class Command(val name: String, val path: String) : SelectedItem()
}

enum class MentionKind { Skill, Command }

data class MentionItem(
    val trigger: String,
    val label: String,
    val description: String? = null,
    val kind: MentionKind = MentionKind.Command,
    val path: String? = null,
)
