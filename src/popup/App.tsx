function App() {
  const openApp = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("reader.html") });
    window.close(); // close popup
  };

  return (
    <div style={{ padding: 16 }}>
      <button onClick={openApp} style={{ padding: "8px 12px" }}>
        📖 Open EPUB Reader
      </button>
    </div>
  );
}

export default App;
