package tv.tootie.aurora.app.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.store: DataStore<Preferences> by preferencesDataStore("settings")

object Keys {
    val SERVER_URL = stringPreferencesKey("server_url")
    val AUTH_TOKEN = stringPreferencesKey("auth_token")
    val MODEL = stringPreferencesKey("model")
}

class AppSettings(private val ctx: Context) {
    // 10.0.2.2 = Android emulator alias for host machine's 127.0.0.1
    val serverUrl: Flow<String> = ctx.store.data.map { it[Keys.SERVER_URL] ?: "ws://10.0.2.2:4500" }
    val authToken: Flow<String?> = ctx.store.data.map { it[Keys.AUTH_TOKEN] }
    val model: Flow<String> = ctx.store.data.map { it[Keys.MODEL] ?: "gpt-5.5" }

    suspend fun setServerUrl(v: String) = ctx.store.edit { it[Keys.SERVER_URL] = v }
    suspend fun setAuthToken(v: String?) = ctx.store.edit {
        if (v != null) it[Keys.AUTH_TOKEN] = v else it.remove(Keys.AUTH_TOKEN)
    }
    suspend fun setModel(v: String) = ctx.store.edit { it[Keys.MODEL] = v }
}
