package tv.tootie.aurora.app.ui.chat

/** Pure connection lifecycle reducer shared by asynchronous repository callbacks. */
internal sealed interface ConnectionTransition {
    data object Connecting : ConnectionTransition
    data object Ready : ConnectionTransition
    data class Failed(val message: String) : ConnectionTransition
    data object Disconnected : ConnectionTransition
}

internal fun reduceConnection(state: ChatState, transition: ConnectionTransition): ChatState =
    when (transition) {
        ConnectionTransition.Connecting -> state.copy(connected = false, error = null)
        ConnectionTransition.Ready -> state.copy(connected = true, error = null)
        is ConnectionTransition.Failed -> state.copy(connected = false, thinking = false, error = transition.message)
        ConnectionTransition.Disconnected -> state.copy(connected = false, thinking = false)
    }
