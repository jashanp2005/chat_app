import { useEffect, useRef, useState } from "react";

const App = () => {

  const [messages, setMessages] = useState(["Hello from server!"]);

  const wsRef = useRef(); // to store WebSocket connection
  const inputRef = useRef(); // to store Input field reference

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000');
    ws.onmessage = (event) => {
      setMessages((prev:any) => [...prev, event.data]);
    }
    
    // @ts-ignore
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }

    return () => {
      ws.close();
    }
  }, [])

  return (
    <div className="h-screen bg-black">

      <br /><br /><br />

      <div className="h-[85vh]">
        {messages.map(message => (
          <div className="m-8">
            <span className="bg-white text-black rounded p-4">{message}</span>
          </div>
        ))}
      </div>

      <div className="w-full bg-white flex">
        {/* @ts-ignore*/}
        <input ref={inputRef} id='message' className="flex-1 p-4"/>
        <button onClick={() => {
          // @ts-ignore
          const message = inputRef.current?.value;
          // @ts-ignore
          wsRef.current.send(JSON.stringify({
            type: "chat",
            payload: {
              message: message
            }
          }))
        }} className="bg-purple-600 text-white p-4">Send Message</button>
      </div>

    </div>
  )
}

export default App;