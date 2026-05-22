package tv.tootie.aurora.app

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import tv.tootie.aurora.app.ui.chat.ChatScreen
import tv.tootie.aurora.app.ui.settings.SettingsScreen
import tv.tootie.aurora.app.ui.threads.ThreadListScreen

sealed class Screen(val route: String) {
    object Threads : Screen("threads")
    object Chat : Screen("chat/{threadId}") {
        fun go(id: String) = "chat/$id"
    }
    object Settings : Screen("settings")
}

@Composable
fun CodexNavHost() {
    val nav = rememberNavController()
    NavHost(nav, startDestination = Screen.Threads.route) {
        composable(Screen.Threads.route) {
            ThreadListScreen(
                onNewThread = { nav.navigate(Screen.Chat.go("new")) },
                onSettings = { nav.navigate(Screen.Settings.route) },
            )
        }
        composable(Screen.Chat.route) { back ->
            val threadId = back.arguments?.getString("threadId") ?: "new"
            ChatScreen(threadId = threadId, onBack = { nav.popBackStack() })
        }
        composable(Screen.Settings.route) {
            SettingsScreen(onBack = { nav.popBackStack() })
        }
    }
}
