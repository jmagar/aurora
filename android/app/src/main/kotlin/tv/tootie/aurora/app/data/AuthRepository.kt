package tv.tootie.aurora.app.data

import android.content.Context

/**
 * Centralises credential lifecycle operations.
 * Call [clearCredentials] on logout before disconnecting the WebSocket.
 */
class AuthRepository(ctx: Context) {

    private val settings = AppSettings(ctx)

    /**
     * Removes the stored auth token from DataStore.
     * The server URL is intentionally preserved so the user does not have to re-enter it
     * after logging back in.
     */
    suspend fun clearCredentials() {
        settings.setAuthToken(null)
    }
}
