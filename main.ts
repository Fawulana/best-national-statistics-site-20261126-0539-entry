// NusaStat hand-in program (Node 22, standard library only).
//
// The entry is the static site in this repository's app/ folder plus the
// screenshots/ folder beside it. This program copies both into the
// output directory and writes output/dossier.json with the vendored
// make.fun library, which is the summary the judge reads: the
// screenshots, the first load's files and bytes, and the site's source.
//
// In the grader the output directory is /output. Anywhere else, the
// MAKEFUN_OUTPUT_DIR environment variable stands in for it:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The program writes the same bytes on every run: it copies files
// verbatim and the dossier builder is deterministic, so the two grader
// runs agree. vendor/makefun-frontend.ts is the kit's copy, unchanged.
// Only the output directory is written; the repository is never modified.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });

const shotsDir = join(repoRoot, 'screenshots');
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });
}

// The caps mirror the gate's own limits (see the kit's reference/gate):
// at most 4 screenshots, each at most 256 KiB; app/ at most 993 files
// and directories and 16 MiB; the dossier text at most 160 KiB.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
