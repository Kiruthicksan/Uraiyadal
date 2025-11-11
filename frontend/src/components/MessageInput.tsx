import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

const MessageInput = () => {
  // custom hook for playing keyboard sound-----
  const { playRandomKeyStrokeSound } = useKeyboardSound();

  // --- local states--

  const [text, setText] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- ref for calling input feild

  const fileInputRef = useRef<HTMLInputElement>(null);

  // global states

  const { isSoundEnabled, sendMessage } = useChatStore();

  // logic for sending msg --

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });
    setText("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 border-t border-slate-700/50">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
            <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-slate-700"
          />
          <button
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
            type="button"
            onClick={removeImage}
          >
            <XIcon className="w-4 h-4" />
          </button>
          </div>
        </div>
      )}
      <form
        className="max-w-3xl mx-auto flex space-x-4"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          value={text}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
          placeholder="Type your message..."
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setText(e.target.value);
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
        <button
          type="button"
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${
            imagePreview ? "text-cyan-500" : ""
          }`}
          onClick={() => fileInputRef?.current?.click()}
        >
          <ImageIcon className="h-5 w-5" />
        </button>
        <button
          type="submit"
          disabled={!text?.trim() && !imagePreview}
          className="bg-linear-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
