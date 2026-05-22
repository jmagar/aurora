package tv.tootie.aurora.app.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.store: DataStore<Preferences> by preferencesDataStore("settings")

object Keys {
    val SERVER_URL = stringPreferencesKey("server_url")
    val AUTH_TOKEN = stringPreferencesKey("auth_token")
    val MODEL = stringPreferencesKey("model")
    val THREAD_ID = stringPreferencesKey("thread_id")
    val THREAD_UPDATED_AT = longPreferencesKey("thread_updated_at")
}

class AppSettings(private val ctx: Context) {
    // 10.0.2.2 = Android emulator alias for host machine's 127.0.0.1
    val serverUrl: Flow<String> = ctx.store.data.map { it[Keys.SERVER_URL] ?: "ws://10.0.2.2:4500" }
    val authToken: Flow<String?> = ctx.store.data.map { it[Keys.AUTH_TOKEN] }
    val model: Flow<String> = ctx.store.data.map { it[Keys.MODEL] ?: "gpt-5.5" }
    val savedThreadId: Flow<String?> = ctx.store.data.map { it[Keys.THREAD_ID]?.takeIf { id -> id.isNotBlank() } }

    suspend fun setServerUrl(v: String) = ctx.store.edit { it[Keys.SERVER_URL] = v }
    suspend fun setAuthToken(v: String?) = ctx.store.edit {
        if (v != null) it[Keys.AUTH_TOKEN] = v else it.remove(Keys.AUTH_TOKEN)
    }
    suspend fun setModel(v: String) = ctx.store.edit { it[Keys.MODEL] = v }

    suspend fun saveThread(id: String) = ctx.store.edit {
        it[Keys.THREAD_ID] = id
        it[Keys.THREAD_UPDATED_AT] = System.currentTimeMillis() / 1000L
    }

    suspend fun clearThreadId() = ctx.store.edit {
        it.remove(Keys.THREAD_ID)
        it.remove(Keys.THREAD_UPDATED_AT)
    }

    suspend fun clearSession() = ctx.store.edit {
        it.remove(Keys.THREAD_ID)
        it.remove(Keys.AUTH_TOKEN)
        it.remove(Keys.THREAD_UPDATED_AT)
    }
}
