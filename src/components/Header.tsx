import { useState } from "react";
import { Heart } from "lucide-react";
import ThemeSwitch from "./ThemeSwitch.tsx";
import UserStatus from "./UserStatus.tsx";
import LikedDogsModal from "./LikedDogsModal.tsx";
import Logo from "./Logo.tsx";
import { useDogStore } from "../stores/dog.ts";
import { useAuthStore } from "../stores/auth.ts";

const Header = () => {
  const likedDogsCount = useDogStore((state) => state.likedDogs.length);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  return (
    <header className="p-4 shadow-md bg-base-200 flex items-center justify-between relative">
      <div className="w-24 flex justify-start">
        <ThemeSwitch />
      </div>

      <Logo />

      {isAuthenticated() && (
        <div className="w-24 flex justify-end items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className={`relative btn btn-primary flex items-center ${likedDogsCount > 0 ? "" : "btn-disabled"}`}
          >
            <Heart
              size={20}
              className={likedDogsCount > 0 ? "text-red-500" : "text-base-500"}
              fill={likedDogsCount > 0 ? "red" : "none"}
            />
            <span className="ml-1 text-sm font-bold">{likedDogsCount}</span>
          </button>

          <div className="min-h-[2.5rem]">
            <UserStatus />
          </div>
        </div>
      )}

      {isModalOpen && <LikedDogsModal onClose={closeModal} />}
    </header>
  );
};

export default Header;
