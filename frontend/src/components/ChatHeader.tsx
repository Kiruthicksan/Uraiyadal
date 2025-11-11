import { XIcon } from "lucide-react";
import avatar from "../assets/avatar.png";
import { useChatStore } from "../store/useChatStore";
import { useUpperCase } from "../hooks/useUpperCase";
import { useEffect } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  //   --custom hook

  const capitaizedUserName = useUpperCase(selectedUser?.userName as string);

  // logic to make esc key get out of selecteduser

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedUser(null);
      }
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup funtion ---
    return () => window.removeEventListener("keydown", handleEscKey);
  }, []);
  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">
      <div className="flex items-center space-x-3">
        <div className="avatar-online avatar">
          <div className="w-12 rounded-full">
            <img
              src={selectedUser?.profilePic || avatar}
              alt={selectedUser?.userName}
            />
          </div>
        </div>
        <div>
          <h3 className="text-slate-200 font-medium">{capitaizedUserName}</h3>
          <p className="text-slate-400 text-sm">Online</p>
        </div>
      </div>
      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
};
export default ChatHeader;
