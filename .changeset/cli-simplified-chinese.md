---
"create-mesh-avatar-studio": minor
---

Add Simplified Chinese messages (`--lang zh`, also picked up automatically from a Chinese locale) to the scaffolding CLI, and document the option in the README. The environment check (`tools/doctor.mjs`) and the avatar creation command (`tools/create.mjs`) gain the same `zh` output; prompts sent to the Codex agent stay in English.