import React, { useState } from "react";
import { Chat, User } from "@progress/kendo-react-conversational-ui";
import { Button } from "@progress/kendo-react-buttons";
import { Loader } from "@progress/kendo-react-indicators";
import { AiOutlineMessage, AiOutlineClose } from "react-icons/ai";
import { useStyles } from "./chat.styles";
import type { MessageProps } from "@progress/kendo-react-conversational-ui";

interface ChatMessage {
  author: User;
  text: string;
  responseType?: "message" | "follow_up" | "did_you_mean" | "file";
  options?: string[];
  fileName?: string;
  filePath?: string;
}

interface ApiResponse {
  response_type: "message" | "follow_up" | "did_you_mean" | "file";
  message?: { text: string; context?: string };
  follow_up?: { question: string; options: string[] };
  did_you_mean?: { question: string; suggestions: string[] };
  file?: { name: string; path: string };
}

const user: User = { id: 1, name: "User", avatarUrl: "https://via.placeholder.com/40" };
const bot: User = { id: 2, name: "Bot", avatarUrl: "" };

const initialMessages: ChatMessage[] = [
  { author: bot, text: "**Hello!** I am your AI assistant. 🤖" },
  { author: bot, text: "Ask me about **formulary details**, WAC amounts, and placement." },
];

const ChatBot: React.FC = () => {
  const classes = useStyles();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages(initialMessages);
    }
  };

  const sendMessage = async (event: any) => {
    const userMessage: ChatMessage = { author: user, text: event.message.text };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);
    setMessages((prev) => [...prev, { author: bot, text: "", responseType: "message" }]);

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: event.message.text }),
      });

      const data: ApiResponse = await response.json();
      setIsTyping(false);

      if (data.response_type === "follow_up" && data.follow_up) {
        setMessages((prev) => [
          ...prev,
          {
            author: bot,
            text: data.follow_up.question,
            responseType: "follow_up",
            options: data.follow_up.options,
          },
        ]);
      } else if (data.response_type === "did_you_mean" && data.did_you_mean) {
        setMessages((prev) => [
          ...prev,
          {
            author: bot,
            text: data.did_you_mean.question,
            responseType: "did_you_mean",
            options: data.did_you_mean.suggestions,
          },
        ]);
      } else if (data.response_type === "file" && data.file) {
        setMessages((prev) => [
          ...prev,
          {
            author: bot,
            text: `📄 **Your report is ready:**`,
            responseType: "file",
            fileName: data.file.name,
            filePath: data.file.path,
          },
        ]);
      } else if (data.response_type === "message" && data.message) {
        setMessages((prev) => [...prev, { author: bot, text: data.message.text }]);
      } else {
        setMessages((prev) => [...prev, { author: bot, text: "Sorry, I couldn't process that request." }]);
      }
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [...prev, { author: bot, text: "An error occurred. Please try again later." }]);
    }
  };

  const handleFileDownload = async (filePath: string, fileName: string) => {
    try {
      const response = await fetch(filePath, {
        method: "GET",
      });

      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const customMessageRenderer = (props: MessageProps) => {
    const message = props.item as ChatMessage;
    const isUser = message.author.id === user.id;

    return (
      <div className={`${classes.messageWrapper} ${isUser ? classes.userMessageWrapper : classes.botMessageWrapper}`}>
        {message.author.avatarUrl ? (
          <img src={message.author.avatarUrl} alt={message.author.name} className={classes.avatar} />
        ) : (
          <div className={classes.avatar}>{message.author.name[0]}</div>
        )}

        <div className={classes.messageBubble}>
          {message.text}
          {message.responseType === "file" && message.filePath && (
            <button
              className={classes.downloadButton}
              onClick={() => handleFileDownload(message.filePath!, message.fileName!)}
            >
              📥 {message.fileName}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {!isOpen && (
        <div className={classes.chatIcon} onClick={toggleChat}>
          <AiOutlineMessage size={32} />
        </div>
      )}

      {isOpen && (
        <div className={classes.chatContainer}>
          <div className={classes.chatHeader}>
            <span>Formulary AI Bot</span>
            <Button onClick={toggleChat} className={classes.closeButton}>
              <AiOutlineClose size={20} />
            </Button>
          </div>

          <Chat
            messages={messages}
            onMessageSend={sendMessage}
            user={user}
            placeholder="Ask about formulary..."
            messageTemplate={customMessageRenderer}
          />
        </div>
      )}
    </div>
  );
};

export default ChatBot;
