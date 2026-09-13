# scripts/publish — сборка материалов для площадок

Три инструмента, которыми кейс синхронизируется с Behance, Fiverr и Figma. Все
через `playwright-core` (стоит здесь), поэтому запускаются из `cases/last`.

| Скрипт | Что делает |
|---|---|
| `render-boards.mjs <boards> <out> <name…>` | борд HTML из `docs/portfolio/last/behance/boards/` → PNG @2x в `behance-ready/` |
| `capture-configurator.mjs <out.png>` | скриншот конфигуратора с прода (состояние 5) — исходник борда 03-answer |
| `check-figma-public.mjs <shot.png>` | открыт ли Figma-файл анониму (headful Chrome, свежий профиль) |

Порядок после правки рендеров или цен: `npm run products` → деплой →
`capture-configurator` → `render-boards … 03-answer 06-range 07-packaging` →
заменить блоки на Behance и вложения на Fiverr (`docs/portfolio/last/publish-copy.md`).
