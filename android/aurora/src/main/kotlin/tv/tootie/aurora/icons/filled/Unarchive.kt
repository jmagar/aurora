/*
 * Copyright 2025 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package tv.tootie.aurora.icons.filled

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.materialIcon
import androidx.compose.material.icons.materialPath
import androidx.compose.ui.graphics.vector.ImageVector

public val Icons.Filled.Unarchive: ImageVector
    get() {
        if (_unarchive != null) {
            return _unarchive!!
        }
        _unarchive = materialIcon(name = "Filled.Unarchive") {
            materialPath {
                moveTo(20.55f, 5.22f)
                lineToRelative(-1.39f, -1.68f)
                curveTo(18.88f, 3.21f, 18.47f, 3.0f, 18.0f, 3.0f)
                horizontalLineTo(6.0f)
                curveTo(5.53f, 3.0f, 5.12f, 3.21f, 4.85f, 3.55f)
                lineTo(3.46f, 5.22f)
                curveTo(3.17f, 5.57f, 3.0f, 6.01f, 3.0f, 6.5f)
                verticalLineTo(19.0f)
                curveToRelative(0.0f, 1.1f, 0.89f, 2.0f, 2.0f, 2.0f)
                horizontalLineToRelative(14.0f)
                curveToRelative(1.1f, 0.0f, 2.0f, -0.9f, 2.0f, -2.0f)
                verticalLineTo(6.5f)
                curveTo(21.0f, 6.01f, 20.83f, 5.57f, 20.55f, 5.22f)
                close()
                moveTo(12.0f, 9.5f)
                lineToRelative(5.5f, 5.5f)
                horizontalLineTo(14.0f)
                verticalLineToRelative(2.0f)
                horizontalLineToRelative(-4.0f)
                verticalLineToRelative(-2.0f)
                horizontalLineTo(6.5f)
                lineTo(12.0f, 9.5f)
                close()
                moveTo(5.12f, 5.0f)
                lineToRelative(0.82f, -1.0f)
                horizontalLineToRelative(12.0f)
                lineToRelative(0.93f, 1.0f)
                horizontalLineTo(5.12f)
                close()
            }
        }
        return _unarchive!!
    }

private var _unarchive: ImageVector? = null
