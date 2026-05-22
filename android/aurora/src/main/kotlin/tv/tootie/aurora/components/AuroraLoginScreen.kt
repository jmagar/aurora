package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp

/**
 * Email + password login form. Maps to web `login` auth block.
 *
 * Wrap in a [androidx.compose.material3.Scaffold] for full-screen layout.
 *
 * Security notes:
 * - The password field uses [PasswordVisualTransformation] by default; a show/hide
 *   toggle icon changes to [VisualTransformation.None] when tapped.
 * - The toggle icon carries a dynamic `contentDescription` ("Show password" /
 *   "Hide password") for TalkBack.
 * - The submit button is disabled until both email and password are non-blank
 *   and [isLoading] is false — preventing accidental empty submissions.
 * - All user-visible label strings are caller-supplied parameters with sensible defaults.
 *
 * References from the same package:
 * - [AuroraCallout] / [AuroraCalloutVariant] for inline error display
 * - [AuroraField] for labelled form rows
 * - [AuroraTextField] for text inputs
 * - [AuroraButton] / [AuroraButtonVariant] for the submit action
 *
 * @param onLogin          Callback with collected (email, password) when submit is tapped.
 * @param modifier         Applied to the root [Column].
 * @param title            Headline above the form.
 * @param subtitle         Optional supporting text below [title].
 * @param emailLabel       Label for the email field (default "Email").
 * @param emailPlaceholder Placeholder for the email field.
 * @param passwordLabel    Label for the password field (default "Password").
 * @param submitLabel      Text on the submit button (default "Sign in").
 * @param isLoading        Shows a loading indicator on the submit button.
 * @param error            Optional error message rendered as an [AuroraCallout].
 * @param header           Optional slot rendered above the title (e.g. logo).
 * @param footer           Optional slot rendered below the submit button (e.g. sign-up link).
 */
@Composable
public fun AuroraLoginScreen(
    onLogin: (email: String, password: String) -> Unit,
    modifier: Modifier = Modifier,
    title: String = "Sign in",
    subtitle: String? = null,
    emailLabel: String = "Email",
    emailPlaceholder: String = "you@example.com",
    passwordLabel: String = "Password",
    submitLabel: String = "Sign in",
    isLoading: Boolean = false,
    error: String? = null,
    header: (@Composable () -> Unit)? = null,
    footer: (@Composable () -> Unit)? = null,
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }

    val isSubmitEnabled = email.isNotBlank() && password.isNotBlank() && !isLoading

    Column(
        modifier = modifier.padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        header?.invoke()

        Text(title, style = MaterialTheme.typography.headlineMedium)
        subtitle?.let {
            Text(
                it,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }

        error?.let {
            AuroraCallout(message = it, variant = AuroraCalloutVariant.Error)
        }

        AuroraField(label = emailLabel, required = true) {
            AuroraTextField(
                value = email,
                onValueChange = { email = it },
                placeholder = emailPlaceholder,
                modifier = Modifier.fillMaxWidth(),
            )
        }

        AuroraField(label = passwordLabel, required = true) {
            AuroraTextField(
                value = password,
                onValueChange = { password = it },
                placeholder = "••••••••",
                visualTransformation = if (passwordVisible) {
                    VisualTransformation.None
                } else {
                    PasswordVisualTransformation()
                },
                trailingIcon = {
                    val (icon, description) = if (passwordVisible) {
                        Icons.Default.VisibilityOff to "Hide password"
                    } else {
                        Icons.Default.Visibility to "Show password"
                    }
                    IconButton(
                        onClick = { passwordVisible = !passwordVisible },
                        modifier = Modifier.size(40.dp),
                    ) {
                        Icon(
                            imageVector = icon,
                            contentDescription = description,
                        )
                    }
                },
                modifier = Modifier.fillMaxWidth(),
            )
        }

        Spacer(Modifier.height(4.dp))

        AuroraButton(
            onClick = { onLogin(email, password) },
            modifier = Modifier.fillMaxWidth(),
            enabled = isSubmitEnabled,
            loading = isLoading,
            variant = AuroraButtonVariant.Filled,
        ) {
            Text(submitLabel)
        }

        footer?.invoke()
    }
}
