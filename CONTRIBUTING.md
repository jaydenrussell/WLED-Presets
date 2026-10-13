# Contributing

Thanks for helping grow the preset collection. Presets are easy to add — you only ever edit
`Favorite_Presets.txt`.

## Adding a preset

1. Open `Favorite_Presets.txt`.
2. Add a **name comment** followed by the preset's **single-line JSON**:

   ```jsonc
   //Autumn Glow
   {"bri":140,"seg":{"col":[[255,102,0],[204,51,0],[0,0,0]],"fx":99,"sx":80,"ix":220,"pal":5}}
   ```

3. Rebuild so `wled_presets_Favorites.json` stays in sync:

   ```bash
   node build-presets.mjs
   ```

4. Commit **both** `Favorite_Presets.txt` and the regenerated `wled_presets_Favorites.json`, then
   open a pull request.

> If you forget step 3, CI will build the JSON for you on push. Please keep both files in your
> commit anyway so local runs and CI agree.

## Guidelines

- **One preset per entry.** Keep each preset's JSON on a single line.
- **Name everything.** Use a clear, human-readable name after `//`.
- **Use existing keys.** Stick to standard WLED fields (`bri`, `seg`, `col`, `fx`, `sx`, `ix`,
  `pal`, `transition`, `playlist`, …).
- **Group related presets** with blank lines (e.g. holidays, seasons, moods).
- **No duplicate names** where avoidable — it makes the list confusing.
- **Check the build.** `node build-presets.mjs` must succeed; it reports the exact line number if a
  preset's JSON is malformed.

## Pull request checklist

- [ ] Added or edited presets in `Favorite_Presets.txt`
- [ ] `node build-presets.mjs` runs without errors
- [ ] `wled_presets_Favorites.json` is regenerated and committed
- [ ] Names are descriptive and unique
- [ ] Output stays one preset per line

## Reporting issues

If the build fails or a preset imports incorrectly, please include:

- The offending line(s) from `Favorite_Presets.txt`
- The exact build output (it prints a line number)
- Your WLED version, if the issue is only visible after import
