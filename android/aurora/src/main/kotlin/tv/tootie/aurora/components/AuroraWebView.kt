package tv.tootie.aurora.components

import android.annotation.SuppressLint
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import java.net.URI

/**
 * Embeds an HTTPS page in Compose. Maps to web `web-preview`.
 *
 * The default is an untrusted preview: JavaScript, file/content access, mixed content,
 * cross-origin navigation, and non-HTTPS URLs are blocked. JavaScript can only be
 * enabled by supplying the exact trusted origins that may execute it.
 */
@SuppressLint("SetJavaScriptEnabled")
@Composable
public fun AuroraWebView(
    url: String,
    modifier: Modifier = Modifier,
    enableJavaScript: Boolean = false,
    trustedJavaScriptOrigins: Set<String> = emptySet(),
    onPageFinished: ((String) -> Unit)? = null,
    onBlockedNavigation: ((String) -> Unit)? = null,
) {
    val initialOrigin = webOrigin(url)
    val normalizedTrustedOrigins = trustedJavaScriptOrigins.mapNotNull(::webOrigin).toSet()
    val javaScriptAllowed = enableJavaScript && initialOrigin != null && initialOrigin in normalizedTrustedOrigins

    AndroidView(
        factory = { context ->
            WebView(context).apply {
                webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                        val candidate = request?.url?.toString() ?: return true
                        val allowed = isAllowedWebNavigation(
                            candidate,
                            initialOrigin,
                            if (javaScriptAllowed) normalizedTrustedOrigins else setOfNotNull(initialOrigin),
                        )
                        if (!allowed) onBlockedNavigation?.invoke(candidate)
                        return !allowed
                    }

                    override fun onPageFinished(view: WebView?, url: String?) {
                        url?.let { onPageFinished?.invoke(it) }
                    }
                }
                settings.apply {
                    javaScriptEnabled = javaScriptAllowed
                    domStorageEnabled = javaScriptAllowed
                    allowFileAccess = false
                    allowContentAccess = false
                    mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
                    setSupportMultipleWindows(false)
                }
                WebView.setWebContentsDebuggingEnabled(false)
                if (isAllowedWebNavigation(url, initialOrigin, setOfNotNull(initialOrigin))) {
                    loadUrl(url)
                } else {
                    onBlockedNavigation?.invoke(url)
                }
            }
        },
        update = { webView ->
            if (webView.url != url && isAllowedWebNavigation(url, initialOrigin, setOfNotNull(initialOrigin))) {
                webView.loadUrl(url)
            }
        },
        modifier = modifier,
    )
}

internal fun webOrigin(value: String): String? = runCatching {
    val uri = URI(value)
    if (!uri.scheme.equals("https", ignoreCase = true) || uri.host.isNullOrBlank() || uri.userInfo != null) {
        return@runCatching null
    }
    val port = if (uri.port == -1 || uri.port == 443) "" else ":${uri.port}"
    "https://${uri.host.lowercase()}$port"
}.getOrNull()

internal fun isAllowedWebNavigation(url: String, initialOrigin: String?, allowedOrigins: Set<String>): Boolean {
    val origin = webOrigin(url) ?: return false
    return initialOrigin != null && origin == initialOrigin && origin in allowedOrigins
}
