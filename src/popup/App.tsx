import "./App.css";

function App() {
  const openApp = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("reader.html") });
    window.close(); // close popup
  };

  return (
    <div className="popup">
      <div className="popupIcon">📖</div>
      <div className="popupTitle">EPUB &amp; Manga Reader</div>
      <div className="popupSubtitle">Read your books, beautifully.</div>
      <button className="popupButton" onClick={openApp}>
        Open Reader
      </button>
    </div>
  );
}

export default App;
