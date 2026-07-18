package tv.tootie.aurora.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import tv.tootie.aurora.icons.automirrored.filled.InsertDriveFile
import tv.tootie.aurora.icons.filled.Folder
import tv.tootie.aurora.icons.filled.FolderOpen
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
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList
import kotlinx.collections.immutable.toImmutableList

/**
 * A node in the [AuroraFileTree] hierarchy.
 *
 * Use [AuroraTreeNode.File] for leaf files and [AuroraTreeNode.Directory] for expandable
 * containers. Convert plain `List` to [ImmutableList] via [toImmutableList] before passing
 * to [AuroraFileTree].
 */
public sealed class AuroraTreeNode {
    public abstract val name: String

    /** A leaf file node. */
    public data class File(override val name: String) : AuroraTreeNode()

    /** A directory node that may contain child [AuroraTreeNode]s. */
    public data class Directory(
        override val name: String,
        val children: ImmutableList<AuroraTreeNode> = emptyList<AuroraTreeNode>().toImmutableList(),
    ) : AuroraTreeNode()
}

/**
 * Recursive file tree with expand/collapse directories and full TalkBack support.
 * Maps to web `file-tree`.
 *
 * Each row announces its hierarchy depth and type to accessibility services:
 * - File:      "[name], level [depth], file"
 * - Directory: "[name], level [depth], folder, expanded|collapsed"
 *
 * @param nodes Top-level tree nodes to render.
 * @param modifier Caller-supplied modifier applied to the root [Column].
 * @param onFileClick Optional callback invoked with the file name when a file row is clicked.
 * @param depth Current nesting depth (0-based); callers should leave this at its default.
 */
@Composable
public fun AuroraFileTree(
    nodes: ImmutableList<AuroraTreeNode>,
    modifier: Modifier = Modifier,
    onFileClick: ((String) -> Unit)? = null,
    depth: Int = 0,
) {
    // Human-readable depth label (1-based for screen readers)
    val levelLabel = depth + 1

    Column(modifier = modifier) {
        nodes.forEach { node ->
            when (node) {
                is AuroraTreeNode.File -> {
                    Row(
                        modifier = Modifier
                            .padding(start = (depth * 16).dp, top = 2.dp, bottom = 2.dp)
                            .then(
                                if (onFileClick != null) {
                                    Modifier.clickable(role = Role.Button) { onFileClick(node.name) }
                                } else {
                                    Modifier
                                },
                            )
                            .semantics {
                                contentDescription = "${node.name}, level $levelLabel, file"
                            },
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.InsertDriveFile,
                            // contentDescription is null here; the Row semantics block
                            // provides the full accessible description for TalkBack.
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Text(node.name, style = MaterialTheme.typography.bodySmall)
                    }
                }

                is AuroraTreeNode.Directory -> {
                    var expanded by remember { mutableStateOf(false) }
                    Row(
                        modifier = Modifier
                            .padding(start = (depth * 16).dp, top = 2.dp, bottom = 2.dp)
                            .clickable { expanded = !expanded }
                            .semantics {
                                role = Role.Button
                                contentDescription = "${node.name}, level $levelLabel, folder"
                                stateDescription = if (expanded) "expanded" else "collapsed"
                            },
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                    ) {
                        Icon(
                            imageVector = if (expanded) Icons.Default.FolderOpen else Icons.Default.Folder,
                            // contentDescription is null; the Row semantics block describes
                            // the folder name, depth, and expanded state for TalkBack.
                            contentDescription = null,
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
