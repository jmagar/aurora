/**
 * Style Dictionary v4 config for Aurora Android tokens.
 *
 * Generates separate dark/light Kotlin objects from the named DTCG namespaces.
 * `AuroraColors` remains the dark object for source compatibility;
 * `AuroraLightColors` is the canonical light counterpart.
 */

import StyleDictionary from 'style-dictionary';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const raw = JSON.parse(
  readFileSync(resolve(projectRoot, 'android/tokens/aurora.tokens.json'), 'utf8'),
);

// When invoked from Gradle, AURORA_TOKENS_OUT is set to the absolute path of the
// package directory inside the build directory so generated files land under
// build/generated/aurora-tokens/kotlin/tv/tootie/aurora/tokens.
// When invoked directly via `pnpm run tokens:generate` without Gradle, fall back
// to the conventional build directory location so the script is still runnable standalone.
const outputDir =
  process.env.AURORA_TOKENS_OUT ??
  resolve(
    projectRoot,
    'android/aurora/build/generated/aurora-tokens/kotlin/tv/tootie/aurora/tokens',
  );

async function generateTheme(theme, className, destination) {
  if (!raw[theme]) throw new Error(`Missing ${theme} token namespace`);
  const sd = new StyleDictionary({
    tokens: raw[theme],
    platforms: {
      compose: {
        transformGroup: 'compose',
        buildPath: outputDir + '/',
        files: [
          {
            destination,
            format: 'compose/object',
            filter: (token) => token.$type === 'color',
            options: {
              className,
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

  const outFile = resolve(outputDir, destination);
  let content = readFileSync(outFile, 'utf8');
  content = content.replace(`object ${className}`, `internal object ${className}`);
  content = content.replace(/Color\(0x([0-9a-f]{8})\)/g, (_, hex) => `Color(0x${hex.toUpperCase()})`);
  content = content.replace(/^(package [^\n;]+);$/m, '$1');
  writeFileSync(outFile, content, 'utf8');
}

await generateTheme('dark', 'AuroraColors', 'AuroraColors.kt');
await generateTheme('light', 'AuroraLightColors', 'AuroraLightColors.kt');

// Post-process:
// 1. Replace `object AuroraColors` with `internal object AuroraColors`
//    (SD v4 compose/object does not natively support Kotlin accessControl)
// 2. Normalize hex literals to uppercase: Color(0xffrrggbb) -> Color(0xFFRRGGBB)
// 3. Strip trailing semicolon from package declaration (SD emits Java-style)
console.log('✓ AuroraColors.kt and AuroraLightColors.kt generated');
