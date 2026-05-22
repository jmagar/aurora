package tv.tootie.aurora.components

import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView

/**
 * Embeds an Android WebView in Compose. Maps to web `web-preview`.
 * JavaScript is disabled by default — enable only when necessary and trusted.
 */
@Composable
public fun AuroraWebView(
    url: String,
    modifier: Modifier = Modifier,
    enableJavaScript: Boolean = false,
    onPageFinished: ((String) -> Unit)? = null,
) {
    AndroidView(
        factory = { context ->
            WebView(context).apply {
                webViewClient = object : WebViewClient() {
                    override fun onPageFinished(view: WebView?, url: String?) {
                        url?.let { onPageFinished?.invoke(it) }
                    }
                }
                settings.javaScriptEnabled = enableJavaScript
                loadUrl(url)
            }
        },
        update = { webView -> webView.loadUrl(url) },
        modifier = modifier,
    )
}
