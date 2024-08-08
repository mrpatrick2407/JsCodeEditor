import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
function App() {
  const [code, setCode] = useState("");
  const [call, setCall] = useState("");
  const [result, setResult] = useState("");
  const [time, setTime] = useState("");
  const [memory, setMemory] = useState("");
  const [log,setLog]=useState([]);
  const sendCode = () => {
    console.log(`${code} ${call}`)
    fetch("http://localhost:3000/eval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        call,
      }),
    })
      .then((response) => response.json())
      .then(({ result, time, memory,console }) => {
        setResult(result);
        setTime(time);
        setMemory(memory);
        setLog(console)
      });
  };
  return (
    <div
      style={{
        marginLeft:"-7.8%",
        display: "flex",
        flexDirection: "column",
        height: "94vh",
        width: '98.5vw',
        fontFamily: '"Montserrat", "sans-serif"',
        backgroundColor: "black",
        color: "white",
      }}
    >
      <div
        style={{
          fontSize: "1.25rem",
          padding: "1rem",
          fontWeight: "bold",
        }}
      >
        Javascript Playground
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
          padding: "1rem",
        }}
      >
        <div style={{ flex: 3 }}>
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) => highlight(code, languages.js)}
            padding={20}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              height: "80%",
              backgroundColor: "#383838",
              color: "white",
              borderRadius: "0.25rem",
            }}
          />
          <div style={{ marginTop: "0.5rem", width: "99%" }}>
            <input
              value={call}
              onChange={(e) => setCall(e.target.value)}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                width: "100%",
                backgroundColor: "#383838",
                color: "white",
                fontSize: "14px",
                padding: "0.5rem 0rem",
                paddingLeft: "0.75rem",
                borderRadius: "0.25rem",
                border: "none",
                outline: "none",
              }}
            />
          </div>
          <button
            style={{
              marginTop: 10,
              backgroundColor: "green",
              border: "none",
              color: "white",
              borderRadius: "0.25rem",
              padding: "1rem",
              cursor: "pointer",
              fontFamily: '"Montserrat", "sans-serif"',
            }}
            onClick={() => {
              sendCode();
            }}
          >
            Run
          </button>
        </div>
        <div
          style={{
            flex: 2,
            height: "90%",
            marginLeft: "0.75rem",
            backgroundColor: "#383838",
            borderRadius: "0.25rem",
          }}
        >
          <div style={{ padding: "1rem" }}>Result</div>
          <div
            style={{
              paddingLeft: "1rem",
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
            }}
          >
            <div>{result}</div>
            {time && <div>Total CPU time: {time}s</div>}
            {memory && <div>Total memory used: {memory}kb</div>}
            <div>
            {log && log.length > 0 ? (
              <div>
                <h3>Standard Output:</h3>
                {log.map((entry, index) => (
                  <div key={index}>{entry}</div>
                ))}
              </div>
            ) : (
              <p>No logs to display</p>
            )}
    </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
