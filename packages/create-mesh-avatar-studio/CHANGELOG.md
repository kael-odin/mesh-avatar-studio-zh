# create-mesh-avatar-studio

## 0.2.0

### Minor Changes

- 5fcb8bd: Add Simplified Chinese messages (`--lang zh`, also picked up automatically from a Chinese locale) to the scaffolding CLI, and document the option in the README. The environment check (`tools/doctor.mjs`) and the avatar creation command (`tools/create.mjs`) gain the same `zh` output; prompts sent to the Codex agent stay in English.

## 0.1.1

### Patch Changes

- 144ebc9: Show an animated demo of face tracking at the top of the README.

## 0.1.0

### Minor Changes

- af1c9d7: First release: `npx create-mesh-avatar-studio` downloads Mesh Avatar Studio, installs its packages and checks Node.js, uv, Python and Playwright Chromium, explaining what each missing tool is needed for.
