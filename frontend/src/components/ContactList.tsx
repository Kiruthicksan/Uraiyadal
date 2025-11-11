import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeloton";
import avatar from "../assets/avatar.png";
import { useUpperCase } from "../hooks/useUpperCase";

const ChatList = () => {
  const { getAllContacts, loadingContacts, allContacts, setSelectedUser } =
    useChatStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (loadingContacts) return <UsersLoadingSkeleton />;

 



  return (
    <>
      {allContacts?.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar avatar-online`}>
              <div className="size-12 rounded-full">
                <img
                  src={contact.profilePic || avatar}
                  alt={contact.userName}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">
              {useUpperCase(contact.userName)}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
};
export default ChatList;
