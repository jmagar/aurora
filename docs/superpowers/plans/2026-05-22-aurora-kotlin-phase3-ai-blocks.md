# Aurora Kotlin Phase 3 — AI Agent Blocks

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Implement 37 AI-specific Aurora Kotlin/Compose components — the agent identity, conversation, reasoning, workflow, and input blocks that power the Aurora operator console on Android.

**Architecture:** All components are custom Composables. AI identity uses violet accent (`aurora.accentViolet`). Conversation uses cyan for user messages. All components follow the same package/explicitApi() conventions as Phases 1 & 2.

**Beads:** `aurora-design-system-6rm` | **Epic:** `aurora-design-system-xr7`

**Component directory:** `android/aurora/src/main/kotlin/tv/tootie/aurora/components/`

---

## Batch A — Core AI Identity: Agent, Panel, Persona, ModelSelector, VoiceSelector, MicSelector, PromptInput
## Batch B — Conversation: Conversation, Message, InlineCitation, Snippet, Sources, OpenInChat
## Batch C — Reasoning/Thinking: Thinking, ChainOfThought, Reasoning, Artifact, AskUserQuestion, Controls
## Batch D — Task/Workflow: Task, Plan, Queue, Checkpoint, Commit, TestResults, StackTrace
## Batch E — AI Elements: AudioPlayer, Transcription, SpeechInput, SchemaDisplay, PackageInfo, Sandbox, Context
## Batch F — Visual/Utility: AiShimmer, ToolCalls, Suggestion (already done as SuggestionChip), Image, Canvas, Connection, EnvironmentVariables
