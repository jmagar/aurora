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
enum class ApprovalPolicy(
    val wire: String,
    val displayName: String,
    val description: String,
) {
    Untrusted("untrusted", "Untrusted", "Approve every command"),
    OnFailure("on-failure", "On Failure", "Auto-approve until something fails"),
    OnRequest("on-request", "On Request", "Ask before each command"),
    Never("never", "Never", "Run fully autonomously"),
    Granular("granular", "Granular", "Configure per-feature toggles below"),
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
 * Per-turn sandbox isolation policy sent as `sandboxPolicy` on `turn/start`.
 *
 * Protocol shape (all variants carry a `type` discriminant):
 *   dangerFullAccess  — no isolation; agent has full host access
 *   readOnly          — host filesystem read-only; optional `networkAccess`
 *   workspaceWrite    — writes allowed inside `writableRoots`; optional `networkAccess`
 *   externalSandbox   — delegate to an externally-managed sandbox
 *
 * [DangerFullAccess] is the default (wire: omit sandboxPolicy entirely = server default).
 * Only [ReadOnly] and [WorkspaceWrite] carry sub-options; the other two are singletons.
 */
sealed class SandboxPolicy(
    val displayName: String,
    val description: String,
) {
    /** No isolation — full host access. Protocol: omit the `sandboxPolicy` key. */
    object DangerFullAccess : SandboxPolicy(
        displayName = "Full access",
        description = "No isolation — agent has full host access (default)",
    )

    /** Host filesystem is read-only. */
    data class ReadOnly(val networkAccess: Boolean = false) : SandboxPolicy(
        displayName = "Read-only",
        description = "No filesystem writes; network optional",
    )

    /** Writes allowed inside [writableRoots] only. */
    data class WorkspaceWrite(
        val writableRoots: List<String> = emptyList(),
        val networkAccess: Boolean = false,
    ) : SandboxPolicy(
        displayName = "Workspace write",
        description = "Write access limited to specified directories",
    )

    /** Delegate to an externally-managed sandbox. */
    object ExternalSandbox : SandboxPolicy(
        displayName = "External sandbox",
        description = "Delegate isolation to an external sandbox",
    )

    companion object {
        /** Ordered list for display in the sandbox policy selector. */
        val all: List<SandboxPolicy> = listOf(
            DangerFullAccess,
            ReadOnly(),
            WorkspaceWrite(),
            ExternalSandbox,
        )
    }
}

/**
 * Who reviews approval requests.
 *
 * Protocol values for turn/start `approvalsReviewer`:
 *   "user"        — the human user reviews each request (default)
 *   "auto_review" — an automated reviewer handles them
 */
enum class ApprovalsReviewer(
    val wire: String,
    val displayName: String,
    val description: String,
) {
    User("user", "User", "I review each request"),
    AutoReview("auto_review", "Auto Review", "Automated handler reviews"),
    ;

    companion object {
        fun fromWire(v: String): ApprovalsReviewer =
            entries.find { it.wire == v } ?: User
    }
}
