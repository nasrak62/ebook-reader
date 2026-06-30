# Chrome Web Store Listing

Reference copy for the Chrome Web Store developer console. Paste each field
into the console at: https://chrome.google.com/webstore/devconsole

## Store listing tab

**Title**

```
EPUB & Manga Reader
```

**Summary** (132 char max)

```
Read EPUB books and manga in your browser. Streams huge files smoothly and syncs your reading progress across devices via Google Drive.
```

**Description**

```
EPUB & Manga Reader is a fast, private, and user-friendly reader for EPUB books and manga — right in your browser.

KEY FEATURES

• EPUB & Manga support — Read your favorite books and comics directly in Chrome.

• Built for huge files — Unlike typical readers, this extension streams the current chapter in real time while intelligently caching the previous and next chapters. It handles massive EPUB files (20+ GB) smoothly without consuming excessive memory.

• Reading progress sync — Your current chapter and page are automatically saved and synced to a private folder in your own Google Drive.

• Cross-device reading — Pick up exactly where you left off on any device where you're signed in.

• Local & private — Files are read locally from your computer. Your data stays private.

• Customizable — Adjust reading settings for a comfortable experience.

PRIVACY

This extension does not collect personal information. The only data it handles is your reading progress (chapter and page number), stored privately in your Google Drive's appDataFolder, which only this extension can access. Nothing is sent to external servers or third parties.

Full privacy policy: https://nasrak62.github.io/ebook-reader/privacy.html
```

**Category:** Productivity

**Language:** English

**Homepage URL:** https://nasrak62.github.io/ebook-reader/

**Support URL:** https://github.com/nasrak62/ebook-reader/issues

## Privacy tab

**Single purpose**

```
This extension is a reader for EPUB and manga files. Its single purpose is to let users open and read EPUB/manga files in the browser and to sync their reading position across devices.
```

**Permission justifications**

- **storage**

  ```
  Used to save the user's reading settings and cache chapter data locally for fast, smooth reading of large files.
  ```

- **tabs**

  ```
  Used to open and manage the reader view in a browser tab so users can read their books and manga.
  ```

- **identity**

  ```
  Used to authenticate the user with their Google account so reading progress can be synced to their own Google Drive. No identity information is stored or transmitted to us.
  ```

- **host permission `https://www.googleapis.com/`**

  ```
  Required to call the Google Drive API to read and write the user's reading-progress sync file in their private appDataFolder.
  ```

- **oauth2 scope `drive.appdata`**

  ```
  Used to store and retrieve a single small sync file (reading progress) in the user's private Google Drive App Data folder. This folder is hidden from normal Drive and accessible only by this extension.
  ```

**Data usage certifications** (check all three):

- I do not sell or transfer user data to third parties (outside approved use cases)
- I do not use or transfer user data for purposes unrelated to my item's single purpose
- I do not use or transfer user data to determine creditworthiness or for lending

**Privacy policy URL:** https://nasrak62.github.io/ebook-reader/privacy.html

## Package tab

Upload `e-reader.zip` (current version: 1.0.1).

## Still required (must be done manually)

- At least one screenshot: 1280×800 or 640×400.
- Click **Submit for review**.
