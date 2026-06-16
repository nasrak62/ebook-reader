import classes from "./App.module.css";

function App() {
  const openApp = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("reader.html") });
    window.close(); // close popup
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>EPUB & Manga Reader</h1>
      <p className={classes.subtitle}>Open the reader in a new tab.</p>
      <button className={classes.button} onClick={openApp}>
        📖 Open Reader
      </button>
    </div>
  );
}

export default App;
