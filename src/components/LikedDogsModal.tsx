import { useState } from "react";
import { useDogStore } from "../stores/dog.ts";
import { Dog } from "../services/dogApi/dtos.ts";

type LikedDogsModalProps = {
  onClose: () => void;
};

const LikedDogsModal = ({ onClose }: LikedDogsModalProps) => {
  const likedDogs = useDogStore((state) => state.likedDogs);
  const matchDogs = useDogStore((state) => state.matchDogs);

  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [matchedDog, setMatchedDog] = useState<null | Dog>(null);

  const handleMatch = async () => {
    try {
      setIsMatching(true);
      const matchedDog = await matchDogs();
      if (!matchedDog) return;
      setMatchedDog(matchedDog);
    } finally {
      setIsMatching(false);
    }
  };

  const handleMatchClick = () => void handleMatch();

  return (
    <div className="z-15 fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-base-100 p-6 rounded-lg w-[400px] shadow-lg">
        <h2 className="text-lg font-bold mb-4">Liked Dogs</h2>

        {matchedDog ? (
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold">You matched with:</h3>
            <img
              src={matchedDog.img}
              alt={matchedDog.name}
              className="w-24 h-24 object-cover rounded-full mt-2"
            />
            <p className="text-lg font-semibold mt-2">{matchedDog.name}</p>
            <p className="text-sm text-gray-600">{matchedDog.breed}</p>
          </div>
        ) : (
          <ul className="max-h-60 overflow-y-auto space-y-2">
            {likedDogs.map((dog) => (
              <li
                key={dog.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div>
                  <p className="font-semibold">{dog.name}</p>
                  <p className="text-sm text-gray-600">{dog.breed}</p>
                </div>
                <img
                  src={dog.img}
                  alt={dog.name}
                  className="w-12 h-12 object-cover rounded"
                />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex justify-between">
          <button className="btn btn-outline" onClick={onClose}>
            {matchedDog ? "Close" : "Cancel"}
          </button>
          {likedDogs.length > 0 && !matchedDog && (
            <button
              className={`btn btn-primary ${isMatching ? "btn-disabled" : ""}`}
              onClick={handleMatchClick}
            >
              {isMatching ? (
                <>
                  <span className="loading loading-spinner" /> Matching
                </>
              ) : (
                "Match"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedDogsModal;
