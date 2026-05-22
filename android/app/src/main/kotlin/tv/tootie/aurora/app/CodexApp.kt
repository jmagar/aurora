package tv.tootie.aurora.app

import android.app.Application
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ProcessLifecycleOwner
import tv.tootie.aurora.app.codex.CodexRepository

class CodexApp : Application() {
    val repository: CodexRepository by lazy { CodexRepository() }

    override fun onCreate() {
        super.onCreate()
        // ProcessLifecycleOwner.onDestroy fires when the app process is genuinely
        // going away — unlike Application.onTerminate(), which is only called in
        // emulated environments and never on real devices.
        ProcessLifecycleOwner.get().lifecycle.addObserver(object : DefaultLifecycleObserver {
            override fun onDestroy(owner: LifecycleOwner) {
                repository.disconnect()
            }
        })
    }
}
