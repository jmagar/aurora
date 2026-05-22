package tv.tootie.aurora.app

import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.launch
import tv.tootie.aurora.app.ui.chat.ChatScreen
import tv.tootie.aurora.app.ui.settings.SettingsScreen
import tv.tootie.aurora.app.ui.sidebar.SessionsSidebar
import tv.tootie.aurora.app.ui.sidebar.SidebarViewModel

sealed class Screen(val route: String) {
    object Chat : Screen("chat/{threadId}") {
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
    val sidebarVm: SidebarViewModel = viewModel()
    val sidebarState by sidebarVm.state.collectAsStateWithLifecycle()

    LaunchedEffect(Unit) { sidebarVm.connect() }

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            SessionsSidebar(
                projects = sidebarState.projects,
                activeSessionId = sidebarState.activeSessionId,
                isLoading = sidebarState.isLoading,
                onSessionClick = { id ->
                    sidebarVm.setActiveSession(id)
                    sidebarVm.setCurrentThread(id)
                    nav.navigate(Screen.Chat.go(id)) {
                        popUpTo(Screen.Chat.route) { inclusive = false }
                        launchSingleTop = true
                    }
                    scope.launch { drawerState.close() }
                },
                onNewSession = {
                    sidebarVm.setCurrentThread(null)
                    nav.navigate(Screen.Chat.NEW) {
                        popUpTo(Screen.Chat.route) { inclusive = true }
                    }
                    scope.launch { drawerState.close() }
                },
                onSettings = {
                    nav.navigate(Screen.Settings.route)
                    scope.launch { drawerState.close() }
                },
                currentGoal = sidebarState.currentGoal,
                showGoalEditor = sidebarState.showGoalEditor,
                onShowGoalEditor = { sidebarVm.showGoalEditor() },
                onSetGoal = { sidebarVm.setGoal(it) },
                onClearGoal = { sidebarVm.clearGoal() },
                onHideGoalEditor = { sidebarVm.hideGoalEditor() },
            )
        },
    ) {
        NavHost(nav, startDestination = Screen.Chat.NEW) {
            composable(Screen.Chat.route) { back ->
                val threadId = back.arguments?.getString("threadId") ?: "new"
                ChatScreen(
                    threadId = threadId,
                    onOpenSidebar = { scope.launch { drawerState.open() } },
                    onBack = { nav.popBackStack() },
                )
            }
            composable(Screen.Settings.route) {
                SettingsScreen(onBack = { nav.popBackStack() })
            }
        }
    }
}
