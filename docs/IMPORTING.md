# Importing the presets into WLED

[← Back to README](../README.md)

This guide loads the **generated** `wled_presets_Favorites.json` onto your WLED device.

> **Important:** upload `wled_presets_Favorites.json` (the generated file) — **not**
> `Favorite_Presets.txt`. The `.txt` source is intentionally not valid JSON.

> **Warning:** uploading replaces **all** presets currently on the device. Export a backup first if
> you want to keep them.

> **Note on names:** on the device the file is always stored as `presets.json`. The repo's
> `wled_presets_Favorites.json` is simply the file *you* upload; WLED renames it on import.

## Prerequisites

- The device is on your network and you know its IP address (e.g. `192.168.1.42`).
- **OTA lock is turned off.** In the WLED web UI go to **Settings → Security & Update** and make
  sure the OTA lock is disabled; the file manager at `/edit` is not available while it is on.
- You have run the build (or pulled the latest from this repo), so `wled_presets_Favorites.json`
  exists.

## Steps

1. **Open the file manager.** In a browser, go to:

   ```text
   http://<device-ip>/edit
   ```

   Replace `<device-ip>` with your controller's address.

2. **Back up (optional).** In the file list, right-click the device's `presets.json` and
   **Download** to keep a copy of your current presets.

3. **Choose your new file.** Click **Choose file** and select `wled_presets_Favorites.json` from
   this repo.

4. **Upload.** Click **Upload**. The device writes the new presets (replacing the old ones).

5. **Verify.** Open the normal WLED UI (`http://<device-ip>`) and confirm your presets appear in the
   **Presets** list, each with the name from the `//` comments.

## Alternative: settings upload

On some firmware versions you can also restore presets from the regular settings UI instead of
`/edit`:

1. Open **Settings** (gear icon).
2. Go to **Security & Update**.
3. Scroll to the backup/restore area and use the file picker to upload
   `wled_presets_Favorites.json`.

The exact labels vary by WLED version, but the effect is the same as uploading at `/edit`.

## After importing

- Apply a preset by clicking it in the Presets list, or via a macro/playlist.
- If a preset looks wrong, tune the underlying field (e.g. `fx`, `sx`, `ix`, `pal`) in
  `Favorite_Presets.txt`, rebuild, and re-upload.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `/edit` shows a message, no files | OTA lock is on | Disable OTA lock in **Security & Update**. |
| Upload rejected / JSON error | You uploaded `Favorite_Presets.txt` or an incomplete file | Upload the generated `wled_presets_Favorites.json`. |
| Presets appear but are unnamed | Missing `//Name` lines in the source | Add names, rebuild, re-upload. |
| Some presets missing | More presets than device slots | Keep under the device's preset limit (commonly 250). |
| Upload succeeded but no change | Browser cached the UI | Hard-refresh the WLED page. |

---

[← Back to README](../README.md) · [← Source format](FORMAT.md)
