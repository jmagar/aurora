package tv.tootie.aurora.app.ui.chat

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import tv.tootie.aurora.theme.AuroraTheme

@RunWith(RobolectricTestRunner::class)
class ApprovalDecisionDialogTest {
    @get:Rule val compose = createComposeRule()

    @Test fun rendersEveryRecognizedChoiceAndRejectsFailClosed() {
        val decisions = classifyApprovalDecisions(listOf("acceptForSession", "accept", "decline", "cancel"))
        var selected: String? = null
        compose.setContent {
            AuroraTheme {
                ApprovalDecisionDialog(
                    title = "Allow command?",
                    description = "dangerous command",
                    decisions = decisions,
                    onDecision = { selected = it.wireValue },
                )
            }
        }
        decisions.forEach { compose.onNodeWithText(it.label).assertIsDisplayed() }
        compose.onNodeWithText("Decline").performClick()
        assertEquals("decline", selected)
    }

    @Test fun permissiveOnlyPayloadStillRendersRejectButton() {
        val decisions = classifyApprovalDecisions(listOf("accept", "allowForSession"))
        compose.setContent {
            AuroraTheme {
                ApprovalDecisionDialog("Approval", "description", decisions) {}
            }
        }
        compose.onNodeWithText("Decline").assertIsDisplayed()
    }
}
