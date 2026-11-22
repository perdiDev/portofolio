# .kiro: workspace configuration

Everything here supports one goal: build every page on the design foundation (reference: the home page `/`), to a consistent standard, with the checks running automatically. Design reference: `../DESIGN.md`.

| Kiro feature           | Where                                                                                  | What it does here                                                        |
| ---------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Steering (always)      | `steering/product.md`, `tech.md`, `structure.md`, `design-system.md`                   | Project facts, folder rules and the design rules, in every session       |
| Steering (fileMatch)   | `steering/motion-and-a11y.md`                                                          | Loads when styles, markup or scripts are read                            |
| Steering (auto)        | `steering/content-voice.md`                                                            | Loads when copy is written                                               |
| Steering (manual)      | `steering/page-playbook.md`                                                            | `#page-playbook` for the page rewrite routine                            |
| File references        | `structure.md` embeds `DESIGN.md`                                                      | One source for design facts                                              |
| Skills (project)       | `skills/foundation-page`, `design-review`, `abstract-illustration`, `playwright`       | Build, review, illustrate, capture                                       |
| Skills (external, MIT) | `skills/astro-best-practices`, `create-component`, `content-collection`, `docs-lookup` | From incluud/astro-agent-skills                                          |
| Skills (global)        | `~/.kiro/skills`: `impeccable`, `design-taste-frontend`, `emil-design-eng`             | Design judgement and interaction polish                                  |
| Hooks                  | `hooks/*.json` + `../scripts/hooks/`                                                   | See below                                                                |
| Custom agents          | `agents/design-engineer.json`, `design-reviewer.json`                                  | Builder with scoped permissions; read-only reviewer                      |
| Specs                  | `specs/foundation-page-rewrite/`                                                       | Requirements, design and tasks for the full rewrite                      |
| MCP                    | `settings/mcp.json`                                                                    | `astro-docs` (current Astro docs), `playwright` (browser)                |
| Powers                 | `image-utils` (installed globally)                                                     | Resize and optimize screenshots and photos                               |
| Knowledge base         | `/knowledge add --name design --path DESIGN.md`                                        | Searchable design reference                                              |
| Permissions            | agent `permissions` rules and the `PermissionRequest` hook                             | Safe commands run without prompts; secrets and generated dirs are denied |

## Hooks

| Hook                  | Trigger                                     | Effect                                                                                                     |
| --------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `design-guard`        | PreToolUse (write)                          | Blocks `.env`, `dist/`, `.astro/`; blocks `transition: all`; asks on raw hex, `define:vars`, global styles |
| `format-on-save`      | PostFileSave                                | Prettier on saved `.astro .css .ts .mjs .json`                                                             |
| `design-gate`         | Stop                                        | Lints changed files; sends the agent back to fix findings (max 2 rounds)                                   |
| `session-context`     | SessionStart, UserPromptSubmit, PostCompact | Injects the foundation rules and branch state                                                              |
| `spec-task-prep`      | PreTaskExec                                 | Reminds to read DESIGN.md and verify                                                                       |
| `allow-safe-commands` | PermissionRequest                           | Auto-approves git status/diff/log, `pnpm check/build/verify/design:lint`                                   |
| `new-file-review`     | PostFileCreate                              | Agent prompt: check a new `.astro` file against the foundation                                             |

## Commands

`pnpm verify` runs design lint, `astro check` and the build. `pnpm design:lint` runs the linter alone.
