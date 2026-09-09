---
name: update-translations
description: Fill the repository's prepared translation gaps and finalize its locale files.
disable-model-invocation: true
---

# Update translations

1. Run `npm run i18n:prepare` and use its complete missing-value report as the work list. If the invoking prompt names locales, limit edits to those locales; otherwise translate every configured platform locale.
2. Fill only missing or empty values in `src/library/i18n/platform`. Preserve every non-empty authored value and each file's nested structure.
3. Preserve interpolation expressions exactly. Interpret contextual key suffixes when choosing wording, and translate each locale-specific plural variant from the matching English plural family. Use British English for `en-GB` and Traditional Chinese for `zh-TW`.
4. Run `npm run i18n:finalize`.
5. Review the complete diff. Report any unresolved translation ambiguity or validation failure; finish only when all requested locales pass finalization.

The repository commands are the deterministic source of truth for extraction, coverage, propagation, and linting. Author translations directly without calling an external translation service.
