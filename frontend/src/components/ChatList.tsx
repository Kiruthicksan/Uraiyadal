import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeloton";
import NoChatsFound from "./NoChatsFound";
import avatar from "../assets/avatar.png";
import { useUpperCase } from "../hooks/useUpperCase";

const ChatList = () => {
  // global states ----
  const { chats, getMyChatPartners, loadingChatsPartners, setSelectedUser } =
    useChatStore();

  // -- custom --hooks

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (loadingChatsPartners) return <UsersLoadingSkeleton />;
  if (chats?.length === 0) return <NoChatsFound />;
  return (
    <>
      {chats?.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar avatar-online`}>
              <div className="size-12 rounded-full">
                <img src={chat.profilePic || avatar} alt={chat.userName} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">
              {useUpperCase(chat.userName)}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
};
export default ChatList;
