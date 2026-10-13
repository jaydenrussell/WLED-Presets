# WLED Presets

A community collection of WLED presets that are easy to copy, paste, and import — plus a tiny
toolchain that turns a human-friendly preset list into a valid, **named** `presets.json`.

- **Want presets now?** Grab [`wled_presets_Favorites.json`](wled_presets_Favorites.json) and import
  it (see [docs/IMPORTING.md](docs/IMPORTING.md)).
- **Want to add your own?** Edit [`Favorite_Presets.txt`](Favorite_Presets.txt) and rebuild (see
  [Add a preset](#add-a-preset)).

> Started by [@Snipercaine](https://github.com/Snipercaine) in
> [Snipercaine/WLED-Presets](https://github.com/Snipercaine/WLED-Presets); this fork is maintained by
> [@jaydenrussell](https://github.com/jaydenrussell).
>
> Companion video: https://www.youtube.com/watch?v=3e2Fdkiss8E

![WLED](https://img.shields.io/badge/WLED-presets-31a3dd)
![Node](https://img.shields.io/badge/node-%3E%3D18-3c873a)
![JSON](https://img.shields.io/badge/output-valid%20JSON-brightgreen)
![PRs](https://img.shields.io/badge/PRs-welcome-blue)

[![Build presets](https://github.com/jaydenrussell/WLED-Presets/actions/workflows/build-presets.yml/badge.svg)](https://github.com/jaydenrussell/WLED-Presets/actions/workflows/build-presets.yml)

---

## Contents

- [Why this repo exists](#why-this-repo-exists)
- [Repository layout](#repository-layout)
- [Quick start](#quick-start)
- [The source format](#the-source-format)
- [Add a preset](#add-a-preset)
- [Build](#build)
- [What the builder changes](#what-the-builder-changes)
- [Output format](#output-format)
- [Import into WLED](#import-into-wled)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Credits](#credits)

---

## Why this repo exists

WLED imports a single file called `presets.json`, and it must be **valid JSON** with each preset's
name stored inside it:

```json
{"0":{},"1":{"n":"Pumpkin candle","on":true,"seg":[{"id":0,"fx":88,...}]}}
```

But preset collections shared around the community (and several app exports) look like this — a name
comment followed by a bare JSON object, with **no name inside** and **JS-style comments** that make
the file **invalid JSON**:

```jsonc
//ColorWinkle
{"bri":60,"seg":{"col":[[255,160,0],[0,0,0],[0,0,0]],"fx":74,"sx":139,"ix":170,"pal":0}}
```

That is easy to read and paste, but WLED won't accept it, and the preset has no name. This repo keeps
the friendly format as the **source of truth** and builds the strict, importable file from it — so
names are never lost and the output always parses.

## Repository layout

```text
WLED-Presets/
├── Favorite_Presets.txt          # EDIT THIS — //Name + one-line JSON per preset
├── wled_presets_Favorites.json   # GENERATED — import this into WLED
├── build-presets.mjs             # Zero-dependency converter (Node >= 18)
├── README.md
├── CONTRIBUTING.md
├── docs/
│   ├── FORMAT.md                 # Source grammar + preset JSON field reference
│   └── IMPORTING.md              # How to load the JSON into WLED
└── .github/
    └── workflows/
        └── build-presets.yml     # Rebuilds the JSON automatically on push
```

| File | Role |
| --- | --- |
| `Favorite_Presets.txt` | The thing you edit. One `//Name` line, then one JSON object on the next line. |
| `wled_presets_Favorites.json` | Generated artifact. **Do not edit by hand** — it is overwritten on every build. |
| `build-presets.mjs` | Parses the source, applies names, normalizes segments, writes valid JSON. |
| `.github/workflows/build-presets.yml` | Runs the build in CI and commits the result back. |

## Quick start

```bash
# 1. Add or edit presets in Favorite_Presets.txt   (see below)

# 2. Build the importable file
node build-presets.mjs

# 3. Upload wled_presets_Favorites.json to WLED    (see docs/IMPORTING.md)
```

No dependencies, no install step — just Node 18+.

## The source format

Each preset is a **name comment** followed by a **single-line JSON object**:

```jsonc
//ColorWinkle
{"bri":60,"seg":{"col":[[255,160,0],[0,0,0],[0,0,0]],"fx":74,"sx":139,"ix":170,"pal":0}}

//Halloween
{"bri":128,"seg":{"col":[[255,0,0],[255,255,255],[255,0,255]],"fx":53,"sx":15,"ix":118,"pal":0}}
```

| Rule | Meaning |
| --- | --- |
| `//Name` | Sets the name for the **next** preset. Optional, but recommended. |
| `{ ... }` | The preset's state. Must be **valid JSON on one line**. |
| `seg` as object `{...}` **or** array `[{...}]` | Both accepted; the builder normalizes to an array. |
| Blank lines | Ignored — use them freely to group presets. |

> The source file is intentionally **not** valid JSON, which is what makes it comfortable to
> hand-edit. The converter is what turns it into valid JSON.

Full grammar and a field-by-field reference live in [`docs/FORMAT.md`](docs/FORMAT.md).

## Add a preset

1. Open `Favorite_Presets.txt`.
2. Append a name line and a JSON line:

   ```jsonc
   //My New Preset
   {"bri":128,"seg":{"col":[[255,0,0],[0,0,0],[0,0,0]],"fx":90,"ix":128,"pal":0}}
   ```

3. Rebuild: `node build-presets.mjs` (or just push and let the Action do it).

Presets are numbered in the order they appear, starting at index `1`.

## Build

### Locally

```bash
node build-presets.mjs
```

Use custom paths if you keep the files elsewhere:

```bash
node build-presets.mjs <source> <output>
```

The script prints how many presets it built and **fails with the offending line number** if any
preset's JSON is invalid.

### Automatically (GitHub Action)

The included workflow (`.github/workflows/build-presets.yml`) runs on every push that changes
`Favorite_Presets.txt`, `build-presets.mjs`, or the workflow itself, plus manual runs via
**Actions → Build presets → Run workflow**.

It runs the build and commits the regenerated `wled_presets_Favorites.json` back to the repo — so
contributors only ever edit `Favorite_Presets.txt`.

## What the builder changes

For every preset, the builder produces a canonical, import-safe object:

| Action | Why |
| --- | --- |
| Sets `n` from the `//` comment | Names the preset so it shows up labelled in WLED. |
| Adds `"on": true` | Presets turn the lights on when applied. |
| Adds `"mainseg": 0` | Defaults the "main" segment (a common WLED convention). |
| Normalizes `seg` to an **array** and adds `"id"` | Matches WLED's canonical saved format for reliable import. |

Everything else — `col`, `fx`, `sx`, `ix`, `pal`, `bri`, and any other field — is passed through
**untouched**.

## Output format

Valid JSON, one preset per line, ready to import:

```json
{
"0":{},
"1":{"n":"ColorWinkle","on":true,"bri":60,"mainseg":0,"seg":[{"id":0,"col":[[255,160,0],[0,0,0],[0,0,0]],"fx":74,"sx":139,"ix":170,"pal":0}]},
"2":{"n":"Fall Colors","on":true,"bri":99,"mainseg":0,"seg":[{"id":0,"col":[[255,160,0],[0,0,0],[0,0,0]],"fx":73,"sx":18,"ix":117,"pal":31}]}
}
```

- `"0"` is reserved/empty (standard for WLED preset files).
- Presets are keyed `"1"`, `"2"`, `"3"`, … in source order.
- Each line is one self-contained, compact preset object.

## Import into WLED

Short version: open `http://<device-ip>/edit`, click **Choose file**, pick
`wled_presets_Favorites.json`, then **Upload**. OTA lock must be off.

Full step-by-step instructions and warnings: [`docs/IMPORTING.md`](docs/IMPORTING.md).

> **Heads-up:** uploading replaces the presets currently on the device. Back up your existing
> `presets.json` first if you care about them.

## Troubleshooting

<details>
<summary><strong>My new preset didn't appear in the output</strong></summary>

- Make sure the preset is **two lines**: a `//Name` line and a `{...}` line.
- Confirm the file was saved and the build actually ran (check the **Actions** tab if using CI).
</details>

<details>
<summary><strong>The build errors with a line number</strong></summary>

The JSON on that line isn't valid. Common causes: a trailing comma, a missing quote, or a line break
inside the object. Keep each preset's JSON **on a single line**.
</details>

<details>
<summary><strong>Upload is rejected / "invalid JSON"</strong></summary>

Upload the **generated** `wled_presets_Favorites.json`, not `Favorite_Presets.txt`. The `.txt` source
is deliberately not valid JSON.
</details>

<details>
<summary><strong>A preset shows up but has no name</strong></summary>

Add a `//Name` line directly above it in `Favorite_Presets.txt` and rebuild.
</details>

<details>
<summary><strong>How many presets can I have?</strong></summary>

WLED builds typically provide **250 preset slots** (indices `1`–`250`). Keep the list under that.
</details>

## Contributing

Contributions are welcome — especially new presets. See [`CONTRIBUTING.md`](CONTRIBUTING.md).

In short: add your preset to `Favorite_Presets.txt`, run `node build-presets.mjs`, and open a pull
request.

## Credits

- Original collection: [Snipercaine/WLED-Presets](https://github.com/Snipercaine/WLED-Presets)
- Companion video: https://www.youtube.com/watch?v=3e2Fdkiss8E
- Built for [WLED](https://kno.wled.ge/) · preset docs: https://kno.wled.ge/features/presets/

## License

No license file is included by default. Add a `LICENSE` appropriate for this fork before publishing
if you intend others to reuse it.
