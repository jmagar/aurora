package tv.tootie.aurora.app.ui.chat

internal enum class ApprovalDecisionSemantics { Allow, Reject }

internal data class ClassifiedApprovalDecision(
    val wireValue: String,
    val label: String,
    val semantics: ApprovalDecisionSemantics,
    val synthetic: Boolean = false,
)

private val allowValues = setOf(
    "accept", "allow", "approve", "yes", "acceptforsession", "allowforsession", "approveforsession",
)
private val rejectValues = setOf("decline", "deny", "reject", "cancel", "abort", "no")

/**
 * Converts server-controlled labels into a safe UI contract. Unknown values are
 * never rendered or echoed. A rejecting choice is synthesized when the server
 * omits one, so malformed/permissive-only requests always fail closed.
 */
internal fun classifyApprovalDecisions(
    values: List<String>,
    elicitation: Boolean = false,
): List<ClassifiedApprovalDecision> {
    val unique = linkedMapOf<String, ClassifiedApprovalDecision>()
    for (raw in values) {
        val value = raw.trim()
        val normalized = value.lowercase().filter(Char::isLetterOrDigit)
        val semantics = when (normalized) {
            in allowValues -> ApprovalDecisionSemantics.Allow
            in rejectValues -> ApprovalDecisionSemantics.Reject
            else -> continue
        }
        unique.putIfAbsent(
            value,
            ClassifiedApprovalDecision(
                wireValue = value,
                label = value.replace(Regex("([a-z])([A-Z])"), "$1 $2")
                    .replaceFirstChar { it.uppercase() }
                    .take(32),
                semantics = semantics,
            ),
        )
    }
    if (unique.values.none { it.semantics == ApprovalDecisionSemantics.Reject }) {
        val fallback = if (elicitation) "cancel" else "decline"
        unique[fallback] = ClassifiedApprovalDecision(
            wireValue = fallback,
            label = fallback.replaceFirstChar { it.uppercase() },
            semantics = ApprovalDecisionSemantics.Reject,
            synthetic = true,
        )
    }
    return unique.values.sortedBy { it.semantics != ApprovalDecisionSemantics.Reject }
}
