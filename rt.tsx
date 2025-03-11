import React, { useState } from "react";
import { Chat, User } from "@progress/kendo-react-conversational-ui";
import { Button } from "@progress/kendo-react-buttons";
import { Loader } from "@progress/kendo-react-indicators";
import { AiOutlineMessage, AiOutlineClose, AiOutlineExpand, AiOutlineCompress } from "react-icons/ai";
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages(initialMessages);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
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

        <div className={classes.messageBubble}>{message.text}</div>
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
        <div className={`${classes.chatContainer} ${isFullscreen ? classes.fullscreen : ""}`}>
          <div className={classes.chatHeader}>
            <span>Formulary AI Bot</span>
            <div>
              <Button onClick={toggleFullscreen} className={classes.fullscreenButton}>
                {isFullscreen ? <AiOutlineCompress size={20} /> : <AiOutlineExpand size={20} />}
              </Button>
              <Button onClick={toggleChat} className={classes.closeButton}>
                <AiOutlineClose size={20} />
              </Button>
            </div>
          </div>

          <Chat
            messages={messages}
            onMessageSend={() => {}}
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



import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  chatIcon: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#0078d4",
    color: "white",
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease-in-out",
    zIndex: 1000,
    "&:hover": {
      background: "#005ea6",
    },
  },

  chatContainer: {
    position: "fixed",
    bottom: "80px",
    right: "20px",
    width: "400px",
    height: "500px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease-in-out, width 0.3s ease-in-out, height 0.3s ease-in-out",
    zIndex: 1000,
  },

  fullscreen: {
    width: "100vw",
    height: "100vh",
    bottom: "0",
    right: "0",
    borderRadius: "0",
  },

  chatHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#0078d4",
    color: "white",
    padding: "12px",
    fontWeight: "bold",
    fontSize: "16px",
  },

  closeButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "white",
  },

  fullscreenButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "white",
    marginRight: "10px",
  },

  messageBubble: {
    padding: "10px 14px",
    borderRadius: "18px",
    fontSize: "15px",
    maxWidth: "80%",
    wordBreak: "break-word",
    background: "#f3f3f3",
    color: "#333",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },

  userMessageWrapper: {
    flexDirection: "row-reverse",
  },

  botMessageWrapper: {
    flexDirection: "row",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    background: "#0078d4",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "10px",
  },
});
