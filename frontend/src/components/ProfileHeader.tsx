import { useRef, useState, type ChangeEvent } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import avatar from "../assets/avatar.png";
import { LogOutIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";
import clickSound from "../assets/sound/mouse-click.mp3";

const mouseClickSound = new Audio(clickSound);

const ProfileHeader = () => {
  //  --- global states
  const { logOut, user, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleButton } = useChatStore();

  // local states ---

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // logout logic ---

  const handleLogout = async () => {
    await logOut();
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      if (typeof base64Image === "string") {
        setSelectedImage(base64Image);
        await updateProfile({ profilePic: base64Image });
      }
    };
  };
  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* avatar */}

          <div className="avatar avatar-online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef?.current?.click()}
            >
              <img
                src={selectedImage || user?.profilePic || avatar}
                alt="profilepic"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity ">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* username and online text */}

          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {user?.userName}
            </h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* buttons */}

        <div className="flex gap-4 items-center">
          {/* LOGOUT BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={handleLogout}
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* sound toggle btn */}

          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound
                .play()
                .catch((error) => console.log("Audio Play failed :", error));
              toggleButton();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProfileHeader;
