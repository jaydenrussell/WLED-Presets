# Source format and preset reference

[← Back to README](../README.md)

This page documents (1) the **source file** you edit and (2) the **preset object** you put in it.

## 1. The source file: `Favorite_Presets.txt`

The source is a plain text file. It is **not** valid JSON on purpose — it is designed to be
comfortable to read and hand-edit. The converter turns it into valid JSON.

### Grammar

```text
file        := line*
line        := blank | comment | object
blank       := (whitespace only)          # ignored
comment     := "//" text                  # names the next object
object      := "{" ... "}"                # one line of valid JSON
```

- Lines are processed top to bottom.
- A `comment` line (starting with `//`) is **not** emitted as a preset; it only sets the pending name.
- An `object` line is emitted as a preset and consumes the pending name.
- Leading and trailing whitespace on each line is ignored.
- Blank lines are ignored (use them to group related presets).

### Example

```jsonc
//ColorWinkle
{"bri":60,"seg":{"col":[[255,160,0],[0,0,0],[0,0,0]],"fx":74,"sx":139,"ix":170,"pal":0}}

//Fall Colors
{"bri":99,"seg":{"col":[[255,160,0],[0,0,0],[0,0,0]],"fx":73,"sx":18,"ix":117,"pal":31}}

//Halloween
{"bri":128,"seg":{"col":[[255,0,0],[255,255,255],[255,0,255]],"fx":53,"sx":15,"ix":118,"pal":0}}
```

### Rules and gotchas

| Do | Don't |
| --- | --- |
| Keep each preset's JSON on **one line**. | Split a preset's JSON across multiple lines. |
| Use double quotes (`"`) for JSON keys and strings. | Use single quotes or unquoted keys. |
| Put one name comment per preset, directly above it. | Put a comment *after* the JSON on the same line. |
| Trust the build to name/normalize. | Hand-write `n`, `on`, or `mainseg` yourself (harmless, but ignored/overwritten). |

If a JSON line is invalid, the build stops and reports the **line number** and the preset's name.

## 2. The preset object

A preset object holds the light **state** you want that preset to apply. You can include as much or
as little as you need.

### Common fields

| Field | Type | Meaning |
| --- | --- | --- |
| `bri` | number `0–255` | Master brightness. |
| `seg` | object or array | One or more segments. See below. |
| `mainseg` | number | Index of the "main" segment. Added automatically if omitted. |
| `n` | string | Preset name. **Set from your `//` comment automatically.** |
| `on` | boolean | Power state. Added as `true` automatically if omitted. |
| `transition` | number `0–65535` | Transition time (in 100 ms units) applied with the preset. |
| `playlist` | object | Turns the preset into a playlist (see below). |

### Segment fields (`seg[]`)

When `seg` is an array, each element is a segment:

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | number | Segment index. Added automatically for a lone segment object. |
| `col` | number[][] | Up to 3 colors, each `[R,G,B]` (or `[R,G,B,W]` for RGBW). |
| `fx` | number | Effect ID. |
| `sx` | number `0–255` | Effect speed. |
| `ix` | number `0–255` | Effect intensity. |
| `pal` | number | Palette ID. |
| `start` / `stop` | number | LED range for this segment. |
| `grp` / `spc` / `of` | number | Grouping, spacing, and offset. |
| `bri` | number | Per-segment brightness (uses `bri` inside the segment). |
| `on` | boolean | Segment on/off. |

`seg` accepts **either** a single object **or** an array. For example, both of these are valid in the
source and produce the same output:

```jsonc
{"bri":60,"seg":{"col":[[255,160,0],[0,0,0],[0,0,0]],"fx":74,"sx":139,"ix":170,"pal":0}}

{"bri":60,"seg":[{"col":[[255,160,0],[0,0,0],[0,0,0]],"fx":74,"sx":139,"ix":170,"pal":0}]}
```

The builder normalizes both to the array form and adds `"id":0`.

### Playlists

A preset can be a playlist that chains other presets:

```jsonc
//Halloween show
{"playlist":{"ps":[1,2,3,4,5,6],"dur":[300,300,300,300,300,300],"transition":[10,10,10,10,10,10],"repeat":0,"end":0},"on":true}
```

| Playlist field | Meaning |
| --- | --- |
| `ps` | Array of preset indices to play. |
| `dur` | Duration (seconds) for each entry in `ps`. |
| `transition` | Transition time (100 ms units) before each entry. |
| `repeat` | Number of repetitions (`0` = play once). |
| `end` | Preset index to apply when finished (`0` = leave last). |

## 3. Where names come from

The builder maps each `//Name` comment to the preset's `n` field:

```text
//Desert Sky                      {"n":"Desert Sky","on":true, ...}
{"bri":155,"seg":{...}}   ───►   (all other fields preserved)
```

If a preset has no preceding `//` line, it is named `Preset N` (where `N` is its index) so it still
imports cleanly.

---

[← Back to README](../README.md) · [Importing into WLED →](IMPORTING.md)
