import { useState, useEffect } from "react";
import "./App.css";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

export default function App() {
  const [isListening, setIslistening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(() => {
    handleListen();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue..");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stopped mic On Click");
      };
    }

    mic.onstart = () => {
      console.log("Mics on");
    };

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      console.log(transcript);
      setNote(transcript);
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note]);
    setNote("")
    setIslistening(false)
  };

  return (
    <>
      <center>
        <h1>Voice Notes</h1>
      </center>
      <div className="container">
        <div className="box">
          <div>
            <h2>Current Note</h2>
            {isListening ? <span className="blinkingMic">🎙️</span> : <span>🛑🎙️</span>}
            <p>{note}</p>
          </div>
          <div className="buttons">
            <button onClick={handleSaveNote} disabled={!note}>
              Save Note
            </button>
            <button
              onClick={() => (
                setIslistening((prevState) => !prevState)
              )}
            >
              Start/stop
            </button>
          </div>
        </div>
        <div className="box">
          <div>
            <h2>Saved Notes</h2>
            <ul>
              {savedNotes.map((notes, i) => (
                <li key={i}>{notes}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
