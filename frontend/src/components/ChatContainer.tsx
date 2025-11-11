import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceHolder";
import { useUpperCase } from "../hooks/useUpperCase";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  // --- global store

  const { selectedUser, getMessagesByUserId, messages } = useChatStore();
  const { user } = useAuthStore();
  console.log(messages);
  // custom hook --

  const captilizedUserName = useUpperCase(selectedUser?.userName as string);

  useEffect(() => {
    getMessagesByUserId(selectedUser?._id!);
  }, [getMessagesByUserId, selectedUser]);
  console.log(selectedUser?._id)
  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages?.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderId === user?._id ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === user?._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="shared"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}

                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toISOString().slice(11, 16)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoChatHistoryPlaceholder name={captilizedUserName} />
        )}
      </div>
      <MessageInput />
    </>
  );
};
export default ChatContainer;
