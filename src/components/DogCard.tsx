import { SyntheticEvent } from "react";
import { Heart } from "lucide-react";
import { Dog } from "../services/dogApi/dtos.ts";
import { useDogStore } from "../stores/dog.ts";

type DogCardProps = {
  dog: Dog;
};

type ImageLoadEvent = SyntheticEvent<HTMLImageElement, Event>;

const DogCard = ({ dog }: DogCardProps) => {
  const likeDog = useDogStore((state) => state.likeDog);
  const unlikeDog = useDogStore((state) => state.unlikeDog);
  const likedDogs = useDogStore((state) => state.likedDogs);

  const isAlreadyLiked = !!likedDogs.find((likedDog) => likedDog.id === dog.id);

  const handleLike = () => {
    if (isAlreadyLiked) {
      unlikeDog(dog);
      return;
    }
    likeDog(dog);
  };

  const removeImageFilter = (event: ImageLoadEvent) => {
    const image = event.currentTarget;
    image.classList.remove("opacity-0", "blur-md", "brightness-75");
  };

  return (
    <div className="card bg-base-100 shadow-md rounded-lg overflow-hidden h-[380px]">
      <img
        className="w-full h-48 object-cover transition-all duration-500 opacity-0 blur-md brightness-75"
        src={dog.img}
        alt={dog.name}
        loading="lazy"
        onLoad={removeImageFilter}
      />

      <div className="p-4">
        <h2 className="text-lg font-bold">{dog.name}</h2>
        <p className="text-sm text-base-content/70">{dog.breed}</p>

        <div className="mt-2 text-sm">
          <p>
            <span className="font-semibold">Age:</span> {dog.age} years
          </p>
          <p>
            <span className="font-semibold">Location:</span> {dog.zip_code}
          </p>
        </div>

        <button
          onClick={handleLike}
          className={`btn btn-sm mt-4 flex items-center gap-2 w-full ${
            isAlreadyLiked ? "bg-gray-300 text-gray-600" : "btn-outline"
          }`}
        >
          <Heart
            size={16}
            fill={isAlreadyLiked ? "red" : "none"}
            className={isAlreadyLiked ? "text-red-500" : ""}
          />
          {isAlreadyLiked ? "Liked" : "Favorite"}
        </button>
      </div>
    </div>
  );
};

export default DogCard;
