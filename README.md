# My EPUB & Manga Reader

A powerful and user-friendly Chrome Extension for reading EPUB files and manga, with seamless cross-device syncing powered by Google Drive.

## Features

- EPUB & Manga Support: Read your favorite books and comics directly in your browser.

- Efficient Streaming & Caching: Unlike other readers, this extension is built to handle massive EPUB files (20+ GB). It streams the current chapter in real-time while intelligently caching the previous and next chapters, ensuring a seamless and fast reading experience without consuming excessive memory.

- Reading Progress Sync: Automatically saves and syncs your reading progress (chapter and page number) to your Google Drive.

- Cross-Device Reading: Pick up right where you left off on any device where you're signed in to Chrome.

- Local Storage: Reads files locally from your computer, ensuring your data is always private and accessible.

- Customizable Experience: Adjust reading settings for a comfortable experience.

## Installation

The easiest way to use this extension is to install it from the Chrome Web Store.

### Building from Source (for Developers)

To run the extension from source:

1. Clone this repository:

```bash
git clone https://github.com/nasrak62/ebook-reader.git
cd ebook-reader
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Open Chrome and navigate to `chrome://extensions`.

5. Enable "Developer mode" in the top-right corner.

6. Click "Load unpacked" and select the `build` folder from your project directory.

## Google Drive Integration & Privacy

This extension uses your Google account to securely save and sync your reading progress.

- Data Storage: Your reading data is stored privately in a dedicated folder in your Google Drive's "App Data" space. Only this app can access this data.

- Permissions: The extension requests the identity and drive.appdata permissions to enable this syncing functionality.

- Privacy Policy: For more information on how your data is handled, please refer to our full [Privacy Policy](privacy_policy.md).

## Contributing

Feel free to open an issue or submit a pull request if you have suggestions or improvements.

## License

This project is licensed under the [MIT License](LICENSE.md).
