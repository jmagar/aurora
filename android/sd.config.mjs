/**
 * Style Dictionary v4 config for Aurora Android tokens.
 *
 * Strategy: pass `tokens: raw.dark` directly to the SD constructor so the
 * top-level "dark" wrapper is stripped from generated token names.
 * Outputs AuroraColors.kt (color tokens only) as an internal Kotlin object.
 */

import StyleDictionary from 'style-dictionary';
import { readFileSync, writeFileSync } from 'fs';
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
          filter: (token) => token.$type === 'color',
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
//    (SD v4 compose/object does not natively support Kotlin accessControl)
// 2. Normalize hex literals to uppercase: Color(0xffrrggbb) -> Color(0xFFRRGGBB)
// 3. Strip trailing semicolon from package declaration (SD emits Java-style)
const outFile = resolve(outputDir, 'AuroraColors.kt');
let content = readFileSync(outFile, 'utf8');
content = content.replace('object AuroraColors', 'internal object AuroraColors');
content = content.replace(/Color\(0x([0-9a-f]{8})\)/g, (_, hex) => `Color(0x${hex.toUpperCase()})`);
content = content.replace(/^(package [^\n;]+);$/m, '$1');
writeFileSync(outFile, content, 'utf8');

console.log('✓ AuroraColors.kt generated with internal access modifier');
