package tv.tootie.aurora.app

import android.app.Application
import tv.tootie.aurora.app.codex.CodexConnectionManager

class CodexApp : Application() {
    val connectionManager: CodexConnectionManager by lazy { CodexConnectionManager(this) }
}
