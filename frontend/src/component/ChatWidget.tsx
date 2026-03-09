import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import { queryIA } from "../api/IAApi";
import ReactMarkdown from "react-markdown";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ChatWidget({ open, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hola! soy tu asistente virtual para el sistema de gestion 😊",
      sender: "bot",
    },
  ]);

  const [input, setInput] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: (userMessage: string) => queryIA(userMessage),
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: data.answer,
          sender: "bot",
        },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Error consultando la IA 😢",
          sender: "bot",
        },
      ]);
    },
  });

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);

    mutate(input);

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-[75px] right-[65px] w-80 h-96 bg-white shadow-xl rounded-xl z-50 flex flex-col overflow-hidden">


      <div className="bg-gray-900 text-white p-3 flex justify-between items-center">
        <span className="font-semibold">Chat IA</span>
        <button onClick={onClose} className="text-xl cursor-pointer">
          <IoMdClose className="cursor-pointer" />
        </button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[85%] px-3 py-2 rounded-lg text-sm mb-2 
    ${msg.sender === "user"
                ? "bg-gray-800 text-white ml-auto"
                : "bg-white border prose prose-sm max-w-full"
              } 
    wrap-break-word overflow-hidden w-fit`}
          >
            <ReactMarkdown
            >
              {msg.text}
            </ReactMarkdown>
          </div>
        ))}

        {isPending && (
          <div className="bg-white border px-3 py-2 rounded-lg text-sm w-fit">
            Escribiendo...
          </div>
        )}
      </div>

      <div className="border-t p-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribí tu mensaje..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <button
          onClick={sendMessage}
          disabled={isPending}
          className="bg-gray-900 text-white px-4 rounded-lg hover:bg-gray-800 cursor-pointer disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
