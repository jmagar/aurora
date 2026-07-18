package tv.tootie.aurora.app.ui.terminal

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Clear
import tv.tootie.aurora.icons.filled.Stop
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel

/** Aurora navy surface color for the terminal background (dark-first). */
private val TerminalBackground = Color(0xFF07131C)
/** Muted cyan for terminal text output. */
private val TerminalOutputColor = Color(0xFFA7BCC9)
/** Bright cyan for the command prompt. */
private val TerminalPromptColor = Color(0xFF29B6F6)
/** Rose for error output. */
private val TerminalErrorColor = Color(0xFFC78490)

/**
 * Full-screen embedded terminal panel.
 *
 * The user types a command in the input bar at the bottom; tapping the send
 * icon (or pressing IME Done) calls [TerminalViewModel.runCommand] which issues
 * a [command/exec] RPC in PTY mode. Streaming output from [command/exec/outputDelta]
 * notifications is appended to the scrollable output area above. A stop button
 * appears while the process is running and sends SIGTERM via
 * [TerminalViewModel.terminate].
 *
 * [onBack] is invoked when the user taps the back arrow in the top bar.
 * [cwd] is forwarded to [command/exec] as the initial working directory.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TerminalScreen(
    onBack: () -> Unit,
    cwd: String? = null,
    vm: TerminalViewModel = viewModel(),
) {
    val s by vm.state.collectAsStateWithLifecycle()
    var inputLine by remember { mutableStateOf("") }
    val scrollState = rememberScrollState()

    // Auto-scroll to bottom whenever new output arrives.
    LaunchedEffect(s.output) {
        scrollState.animateScrollTo(scrollState.maxValue)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Terminal") },
                navigationIcon = {
                    IconButton(onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    if (s.status == ExecStatus.Running) {
                        IconButton(onClick = { vm.terminate() }) {
                            Icon(
                                Icons.Default.Stop,
                                contentDescription = "Terminate",
                                tint = TerminalErrorColor,
                            )
                        }
                    }
                    IconButton(onClick = { vm.clear() }) {
                        Icon(Icons.Default.Clear, contentDescription = "Clear")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface,
                ),
            )
        },
    ) { pad ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(pad)
                .navigationBarsPadding()
                .imePadding(),
        ) {
            // Output area — dark terminal background, monospace text
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .background(TerminalBackground)
                    .padding(horizontal = 12.dp, vertical = 8.dp)
                    .verticalScroll(scrollState),
            ) {
                Column {
                    // Replay history as prompts + output blocks
                    s.history.dropLast(1).forEach { cmd ->
                        PromptLine(cmd)
                    }

                    // Current command prompt (if any command was run)
                    if (s.command.isNotEmpty()) {
                        PromptLine(s.command)
                    }

                    // Live output
                    if (s.output.isNotEmpty()) {
                        Text(
                            text = s.output,
                            style = TextStyle(
                                fontFamily = FontFamily.Monospace,
                                fontSize = 13.sp,
                                color = if (s.status == ExecStatus.Error) TerminalErrorColor else TerminalOutputColor,
                                lineHeight = 18.sp,
                            ),
                        )
                    }

                    // Exit status badge
                    if (s.status == ExecStatus.Done) {
                        val code = s.exitCode
                        val label = if (code != null) "exit $code" else "done"
                        val color = if (code == 0 || code == null) Color(0xFF7DD3C7) else TerminalErrorColor
                        Text(
                            text = "[$label]",
                            style = TextStyle(fontFamily = FontFamily.Monospace, fontSize = 12.sp, color = color),
                            modifier = Modifier.padding(top = 4.dp),
                        )
                    }

                    // Error banner
                    if (s.status == ExecStatus.Error && s.error != null) {
                        Text(
                            text = "error: ${s.error}",
                            style = TextStyle(fontFamily = FontFamily.Monospace, fontSize = 12.sp, color = TerminalErrorColor),
                            modifier = Modifier.padding(top = 4.dp),
                        )
                    }
                }
            }

            // Running indicator
            if (s.status == ExecStatus.Running) {
                LinearProgressIndicator(
                    modifier = Modifier.fillMaxWidth(),
                    color = TerminalPromptColor,
                    trackColor = TerminalBackground,
                )
            }

            // Command input bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surface)
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Text(
                    text = "$",
                    style = TextStyle(
                        fontFamily = FontFamily.Monospace,
                        fontSize = 14.sp,
                        color = TerminalPromptColor,
                    ),
                )
                BasicTextField(
                    value = inputLine,
                    onValueChange = { inputLine = it },
                    textStyle = TextStyle(
                        fontFamily = FontFamily.Monospace,
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurface,
                    ),
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                    keyboardActions = KeyboardActions(
                        onDone = {
                            if (inputLine.isNotBlank() && s.status != ExecStatus.Running) {
                                vm.runCommand(inputLine, cwd = cwd)
                                inputLine = ""
                            }
                        },
                    ),
                    singleLine = true,
                    modifier = Modifier.weight(1f),
                    decorationBox = { inner ->
                        if (inputLine.isEmpty()) {
                            Text(
                                "Enter command…",
                                style = TextStyle(
                                    fontFamily = FontFamily.Monospace,
                                    fontSize = 14.sp,
                                    color = TerminalOutputColor.copy(alpha = 0.5f),
                                ),
                            )
                        }
                        inner()
                    },
                )
            }
        }
    }
}

/** A single prompt line showing the command in prompt color. */
@Composable
private fun PromptLine(command: String) {
    Text(
        text = "$ $command",
        style = TextStyle(
            fontFamily = FontFamily.Monospace,
            fontSize = 13.sp,
            color = TerminalPromptColor,
            lineHeight = 18.sp,
        ),
    )
}
