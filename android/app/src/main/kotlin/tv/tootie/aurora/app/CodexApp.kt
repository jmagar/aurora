package tv.tootie.aurora.app

import android.app.Application
import tv.tootie.aurora.app.codex.CodexRepository

class CodexApp : Application() {
    val repository: CodexRepository by lazy { CodexRepository() }

    override fun onTerminate() {
        super.onTerminate()
        repository.disconnect()
    }
}
