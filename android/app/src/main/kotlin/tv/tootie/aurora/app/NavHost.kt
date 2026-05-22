package tv.tootie.aurora.app

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.Text
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.launch
import tv.tootie.aurora.app.data.AppSettings
import tv.tootie.aurora.app.ui.chat.ChatScreen
import tv.tootie.aurora.app.ui.login.LoginScreen
import tv.tootie.aurora.app.ui.settings.SettingsScreen
import tv.tootie.aurora.app.ui.sidebar.SessionsSidebar
import tv.tootie.aurora.app.ui.sidebar.SidebarViewModel
import tv.tootie.aurora.app.ui.startup.StartupState
import tv.tootie.aurora.app.ui.startup.StartupViewModel

sealed class Screen(val route: String) {
    object Startup : Screen("startup")
    object Login   : Screen("login")
    object Chat    : Screen("chat/{threadId}") {
        fun go(id: String) = "chat/$id"
        const val NEW = "chat/new"
    }
    object Settings : Screen("settings")
}

@Composable
fun CodexNavHost() {
    val nav = rememberNavController()
    val drawerState = rememberDrawerState(DrawerValue.Closed)
    val scope = rememberCoroutineScope()

    val startupVm: StartupViewModel = viewModel()
    val startupState by startupVm.state.collectAsStateWithLifecycle()

    val sidebarVm: SidebarViewModel = viewModel()
    val sidebarState by sidebarVm.state.collectAsStateWithLifecycle()

    // Trigger startup on first composition
    LaunchedEffect(Unit) { startupVm.start() }

    // Route based on auth result
    LaunchedEffect(startupState) {
        when (startupState) {
            is StartupState.Authenticated -> {
                nav.navigate(Screen.Chat.NEW) {
                    popUpTo(Screen.Startup.route) { inclusive = true }
                }
                // Now that we know we're authenticated, load sidebar threads
                sidebarVm.connect()
            }
            is StartupState.NeedsLogin -> {
                nav.navigate(Screen.Login.route) {
                    popUpTo(Screen.Startup.route) { inclusive = true }
                }
            }
            else -> Unit
        }
    }

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            SessionsSidebar(
                projects = sidebarState.projects,
                activeSessionId = sidebarState.activeSessionId,
                isLoading = sidebarState.isLoading,
                onSessionClick = { id ->
                    sidebarVm.setActiveSession(id)
                    nav.navigate(Screen.Chat.go(id)) {
                        popUpTo(Screen.Chat.route) { inclusive = false }
                        launchSingleTop = true
                    }
                    scope.launch { drawerState.close() }
                },
                onNewSession = {
                    nav.navigate(Screen.Chat.NEW) {
                        popUpTo(Screen.Chat.route) { inclusive = true }
                    }
                    scope.launch { drawerState.close() }
                },
                onSettings = {
                    nav.navigate(Screen.Settings.route)
                    scope.launch { drawerState.close() }
                },
            )
        },
    ) {
        NavHost(nav, startDestination = Screen.Startup.route) {
            composable(Screen.Startup.route) {
                StartupScreen(
                    state = startupState,
                    onRetry = {
                        startupVm.start()
                    },
                )
            }
            composable(Screen.Login.route) {
                LoginScreen(
                    onLoginSuccess = {
                        nav.navigate(Screen.Chat.NEW) {
                            popUpTo(Screen.Login.route) { inclusive = true }
                        }
                    },
                )
            }
            composable(Screen.Chat.route) { back ->
                val threadId = back.arguments?.getString("threadId") ?: "new"
                ChatScreen(
                    threadId = threadId,
                    onOpenSidebar = { scope.launch { drawerState.open() } },
                    onBack = { nav.popBackStack() },
                )
            }
            composable(Screen.Settings.route) {
                SettingsScreen(
                    onBack = { nav.popBackStack() },
                    onReauth = { nav.navigate(Screen.Login.route) },
                )
            }
        }
    }
}

@Composable
private fun StartupScreen(
    state: StartupState,
    onRetry: () -> Unit,
) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center,
    ) {
        when (state) {
            is StartupState.Loading -> CircularProgressIndicator()
            is StartupState.Error   -> Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Text("Connection failed: ${state.message}", textAlign = TextAlign.Center)
                Button(onClick = onRetry) { Text("Retry") }
            }
            else -> { /* navigation happens in LaunchedEffect — nothing to render */ }
        }
    }
}
