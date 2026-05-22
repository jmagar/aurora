package tv.tootie.aurora.app.codex

/**
 * Controls when Codex pauses and asks for approval before executing commands.
 *
 * Protocol values for turn/start `approvalPolicy`:
 *   "untrusted"   — approve all non-trusted-tool calls
 *   "on-failure"  — only ask after a command fails
 *   "on-request"  — ask each time (default, safest)
 *   "never"       — never pause for approval (fully autonomous)
 *   "granular"    — fine-grained per-feature control via [GranularPolicy]
 */
enum class ApprovalPolicy(val wire: String, val displayName: String) {
    Untrusted("untrusted", "Untrusted"),
    OnFailure("on-failure", "On Failure"),
    OnRequest("on-request", "On Request"),
    Never("never", "Never"),
    Granular("granular", "Granular"),
    ;

    companion object {
        fun fromWire(v: String): ApprovalPolicy =
            entries.find { it.wire == v } ?: OnRequest
    }
}

/**
 * Per-feature booleans used when [ApprovalPolicy] is [ApprovalPolicy.Granular].
 *
 * Protocol shape (approvalPolicyGranular object):
 *   mcp_elicitations  — approve MCP tool elicitation requests
 *   sandbox_approval  — approve sandbox shell commands
 *   rules             — enforce approval rules
 *   skill_approval    — approve skill invocations
 */
data class GranularPolicy(
    val mcpElicitations: Boolean = true,
    val sandboxApproval: Boolean = true,
    val rules: Boolean = true,
    val skillApproval: Boolean = true,
)

/**
 * Who reviews approval requests.
 *
 * Protocol values for turn/start `approvalsReviewer`:
 *   "user"        — the human user reviews each request (default)
 *   "auto_review" — an automated reviewer handles them
 */
enum class ApprovalsReviewer(val wire: String, val displayName: String) {
    User("user", "User"),
    AutoReview("auto_review", "Auto Review"),
    ;

    companion object {
        fun fromWire(v: String): ApprovalsReviewer =
            entries.find { it.wire == v } ?: User
    }
}
