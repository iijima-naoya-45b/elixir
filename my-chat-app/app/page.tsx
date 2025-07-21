'use client'

import { useEffect, useState, useRef } from 'react';
import WebSocket from 'isomorphic-ws';

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:4000/socket/websocket');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket Client Connected');
      socket.send(JSON.stringify({ topic: 'room:lobby', event: 'phx_join', payload: {}, ref: 1 }));
    };

    socket.onmessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data);
      if (data.event === 'new_msg') {
        setMessages((prevMessages) => [...prevMessages, data.payload.body]);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ topic: 'room:lobby', event: 'new_msg', payload: { body: input }, ref: 1 }));
      setInput('');
    } else {
      console.log('WebSocket is not open. Ready state is:', socketRef.current?.readyState);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-center py-4 bg-blue-500 text-black">Chat Room</h1>
      <div className="flex-1 overflow-y-auto p-4 text-black justify-center">
        {messages.map((msg, index) => (
          <div key={index} className="bg-white p-2 my-2 rounded shadow-md text-black">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex p-4 bg-white shadow-md">
        <input
          className="flex-1 p-2 border rounded text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
} 