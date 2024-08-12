// DiscordButton.js
import Image from 'next/image';
import Link from 'next/link';
import DiscordImage from "../../assets/image/discord-hover-animation.png";

const DiscordButton = () => {
  return (
    <Link
      href="https://discord.gg/aHjdrJZap9"
      className="relative inline-flex items-center bg-gray-800 text-white py-2 px-4 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-300 mx-4" // Added horizontal margin
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex items-center space-x-2">
        <div className="relative w-8 h-8 flex-shrink-0">
          <Image
            src={DiscordImage}
            alt="Discord Icon"
            layout="fill"
            objectFit="contain"
            className="transition-transform duration-500 ease-in-out transform rotate-0 hover:rotate-360"
          />
        </div>
        <span className="text-lg font-semibold">Connect on Discord</span>
      </div>
      <style jsx>{`
        @keyframes rotate360 {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .relative:hover .absolute > :global(img) {
          animation: rotate360 1s linear infinite;
        }
      `}</style>
    </Link>
  );
};

export default DiscordButton;
