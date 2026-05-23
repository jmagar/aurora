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
    // Auth method keys
    val AUTH_METHOD = stringPreferencesKey("auth_method")         // "apiKey" | "chatgpt" | "chatgptDeviceCode" | "chatgptAuthTokens"
    val API_KEY = stringPreferencesKey("api_key")
    val ACCESS_TOKEN = stringPreferencesKey("access_token")
    val CHATGPT_ACCOUNT_ID = stringPreferencesKey("chatgpt_account_id")
    val DEVICE_CODE = stringPreferencesKey("device_code")         // ephemeral; cleared after exchange
    // Approval policy
    val APPROVAL_POLICY = stringPreferencesKey("approval_policy")       // wire value; default "on-request"
    val APPROVALS_REVIEWER = stringPreferencesKey("approvals_reviewer") // wire value; default "user"
    // Thread persistence
    val THREAD_ID = stringPreferencesKey("thread_id")
    val THREAD_UPDATED_AT = longPreferencesKey("thread_updated_at")
}

class AppSettings(private val ctx: Context) {
    // 10.0.2.2 = Android emulator alias for host machine's 127.0.0.1
    val serverUrl: Flow<String> = ctx.store.data.map { it[Keys.SERVER_URL] ?: "ws://10.0.2.2:4500" }
    val authToken: Flow<String?> = ctx.store.data.map { it[Keys.AUTH_TOKEN] }
    val model: Flow<String> = ctx.store.data.map { it[Keys.MODEL] ?: "gpt-5.5" }

    // Auth method flows
    val authMethod: Flow<String?> = ctx.store.data.map { it[Keys.AUTH_METHOD] }
    val apiKey: Flow<String?> = ctx.store.data.map { it[Keys.API_KEY] }
    val accessToken: Flow<String?> = ctx.store.data.map { it[Keys.ACCESS_TOKEN] }
    val chatgptAccountId: Flow<String?> = ctx.store.data.map { it[Keys.CHATGPT_ACCOUNT_ID] }

    // Approval policy flows
    val approvalPolicy: Flow<String> = ctx.store.data.map { it[Keys.APPROVAL_POLICY] ?: "on-request" }
    val approvalsReviewer: Flow<String> = ctx.store.data.map { it[Keys.APPROVALS_REVIEWER] ?: "user" }

    /** Returns true if enough credentials are stored to attempt connection. */
    val isAuthenticated: Flow<Boolean> = ctx.store.data.map { prefs ->
        prefs[Keys.AUTH_METHOD] != null
    }

    suspend fun setServerUrl(v: String) = ctx.store.edit { it[Keys.SERVER_URL] = v }
    suspend fun setAuthToken(v: String?) = ctx.store.edit {
        if (v != null) it[Keys.AUTH_TOKEN] = v else it.remove(Keys.AUTH_TOKEN)
    }
    suspend fun setModel(v: String) = ctx.store.edit { it[Keys.MODEL] = v }

    suspend fun setAuthMethod(v: String?) = ctx.store.edit {
        if (v != null) it[Keys.AUTH_METHOD] = v else it.remove(Keys.AUTH_METHOD)
    }
    suspend fun setApiKey(v: String?) = ctx.store.edit {
        if (v != null) it[Keys.API_KEY] = v else it.remove(Keys.API_KEY)
    }
    suspend fun setAccessToken(v: String?) = ctx.store.edit {
        if (v != null) it[Keys.ACCESS_TOKEN] = v else it.remove(Keys.ACCESS_TOKEN)
    }
    suspend fun setChatgptAccountId(v: String?) = ctx.store.edit {
        if (v != null) it[Keys.CHATGPT_ACCOUNT_ID] = v else it.remove(Keys.CHATGPT_ACCOUNT_ID)
    }

    suspend fun setApprovalPolicy(v: String) = ctx.store.edit { it[Keys.APPROVAL_POLICY] = v }
    suspend fun setApprovalsReviewer(v: String) = ctx.store.edit { it[Keys.APPROVALS_REVIEWER] = v }

    /** Convenience: clears all auth credentials so the app re-shows LoginScreen on next launch. */
    suspend fun clearAuth() = ctx.store.edit {
        it.remove(Keys.AUTH_METHOD)
        it.remove(Keys.API_KEY)
        it.remove(Keys.AUTH_TOKEN)
        it.remove(Keys.ACCESS_TOKEN)
        it.remove(Keys.CHATGPT_ACCOUNT_ID)
    }

    val savedThreadId: Flow<String?> = ctx.store.data.map {
        it[Keys.THREAD_ID]?.takeIf { id -> id.isNotBlank() }
    }

    suspend fun saveThread(id: String) = ctx.store.edit {
        it[Keys.THREAD_ID] = id
        it[Keys.THREAD_UPDATED_AT] = System.currentTimeMillis() / 1000L
    }

    suspend fun clearThreadId() = ctx.store.edit {
        it.remove(Keys.THREAD_ID)
        it.remove(Keys.THREAD_UPDATED_AT)
    }
}
