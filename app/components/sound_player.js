import useSound from 'use-sound';

const SoundPlayer = ({ soundUrl }) => {
  const [play] = useSound(soundUrl);

  return (
    <button onClick={play}>Play Sound</button>
  );
};

export default SoundPlayer;
