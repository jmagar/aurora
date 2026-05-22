package tv.tootie.aurora.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.FolderOpen
import androidx.compose.material.icons.filled.InsertDriveFile
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp

public sealed class AuroraTreeNode {
    public abstract val name: String

    public data class File(override val name: String) : AuroraTreeNode()
    public data class Directory(
        override val name: String,
        val children: List<AuroraTreeNode> = emptyList(),
    ) : AuroraTreeNode()
}

/**
 * Recursive file tree with expand/collapse directories.
 * Maps to web `file-tree`.
 */
@Composable
public fun AuroraFileTree(
    nodes: List<AuroraTreeNode>,
    modifier: Modifier = Modifier,
    onFileClick: ((String) -> Unit)? = null,
    depth: Int = 0,
) {
    Column(modifier = modifier) {
        nodes.forEach { node ->
            when (node) {
                is AuroraTreeNode.File -> {
                    Row(
                        modifier = Modifier
                            .padding(start = (depth * 16).dp, top = 2.dp, bottom = 2.dp)
                            .then(
                                if (onFileClick != null)
                                    Modifier.clickable(role = Role.Button) { onFileClick(node.name) }
                                else Modifier
                            ),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                    ) {
                        Icon(Icons.Default.InsertDriveFile, contentDescription = null,
                            tint = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(node.name, style = MaterialTheme.typography.bodySmall)
                    }
                }
                is AuroraTreeNode.Directory -> {
                    var expanded by remember { mutableStateOf(false) }
                    Row(
                        modifier = Modifier
                            .padding(start = (depth * 16).dp, top = 2.dp, bottom = 2.dp)
                            .clickable(role = Role.Button) { expanded = !expanded },
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                    ) {
                        Icon(
                            if (expanded) Icons.Default.FolderOpen else Icons.Default.Folder,
                            contentDescription = if (expanded) "Collapse" else "Expand",
                            tint = MaterialTheme.colorScheme.primary,
                        )
                        Text(node.name, style = MaterialTheme.typography.bodySmall)
                    }
                    if (expanded) {
                        AuroraFileTree(
                            nodes = node.children,
                            onFileClick = onFileClick,
                            depth = depth + 1,
                        )
                    }
                }
            }
        }
    }
}
