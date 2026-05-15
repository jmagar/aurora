/**
 * Style Dictionary v4 config for Aurora Android tokens.
 *
 * Strategy: pass `tokens: raw.dark` directly to the SD constructor so the
 * top-level "dark" wrapper is stripped from generated token names.
 * Outputs AuroraColors.kt (color tokens only) as an internal Kotlin object.
 */

import StyleDictionary from 'style-dictionary';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// Load tokens JSON and extract only the `dark` namespace so SD names
// don't get a "dark" prefix in generated property names.
const raw = JSON.parse(
  readFileSync(resolve(projectRoot, 'android/tokens/aurora.tokens.json'), 'utf8'),
);

const outputDir = resolve(
  projectRoot,
  'android/aurora/src/main/kotlin/tv/tootie/aurora/tokens',
);

const sd = new StyleDictionary({
  // Pass the dark subtree directly — no "dark" prefix in generated names
  tokens: raw.dark,
  platforms: {
    compose: {
      transformGroup: 'compose',
      buildPath: outputDir + '/',
      files: [
        {
          destination: 'AuroraColors.kt',
          format: 'compose/object',
          // Only generate color tokens — skip dimension/number tokens
          filter: (token) => token.$type === 'color' || token.type === 'color',
          options: {
            className: 'AuroraColors',
            packageName: 'tv.tootie.aurora.tokens',
            import: ['androidx.compose.ui.graphics.Color'],
            outputReferences: false,
          },
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();

// Post-process:
// 1. Replace `object AuroraColors` with `internal object AuroraColors`
//    (SD v4 compose/object does not natively support accessControl for Kotlin)
// 2. Normalize hex literals to uppercase (e.g. 0xff29b6f6 -> 0xFF29B6F6)
//    for consistent Kotlin style
import { readFileSync as rfs, writeFileSync } from 'fs';
const outFile = resolve(outputDir, 'AuroraColors.kt');
let content = rfs(outFile, 'utf8');
// Add internal access modifier
content = content.replace(/^(object AuroraColors)/m, 'internal object AuroraColors');
// Uppercase hex literals: Color(0xffrrggbb) -> Color(0xFFRRGGBB)
content = content.replace(/Color\(0x([0-9a-f]{8})\)/gi, (_, hex) => `Color(0x${hex.toUpperCase()})`);
writeFileSync(outFile, content, 'utf8');

console.log('✓ AuroraColors.kt generated with internal access modifier');
