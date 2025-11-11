import keystroke1 from "../assets/sound/keystroke1.mp3";
import keystroke2 from "../assets/sound/keystroke2.mp3";
import keystroke3 from "../assets/sound/keystroke3.mp3";
import keystroke4 from "../assets/sound/keystroke4.mp3";

const keyStrokeSounds = [
  new Audio(keystroke1),
  new Audio(keystroke2),
  new Audio(keystroke3),
  new Audio(keystroke4),
];

const useKeyboardSound = () => {
  const playRandomKeyStrokeSound = () => {
    const randomSound =
      keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];
    randomSound.currentTime = 0;
    randomSound
      .play()
      .catch((error) => console.log("Audio Play failed", error));
  };

  return { playRandomKeyStrokeSound };
};

export default useKeyboardSound;
