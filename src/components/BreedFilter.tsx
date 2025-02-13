import { useEffect, useState, ChangeEvent } from "react";
import { useDogStore, Filter } from "../stores/dog.ts";

type InputEvent = ChangeEvent<HTMLInputElement>;

const SUGGESTION_LIMIT = 15;

const BreedFilter = () => {
  const { breeds, fetchBreeds, filter, updateFilter } = useDogStore();

  useEffect(() => {
    void fetchBreeds();
  }, [fetchBreeds]);

  const [searchTerm, setSearchTerm] = useState("");
  const [breedSuggestions, setBreedSuggestions] = useState<string[]>([]);

  const filterSuggestions = () => {
    if (!searchTerm) {
      setBreedSuggestions([]);
      return;
    }

    const selectedBreeds = filter?.breeds ?? [];
    const fuzzySearch = new RegExp(
      searchTerm.toLowerCase().split("").join(".*"),
    );

    const breedSuggestions = [];

    for (const breed of breeds) {
      if (breedSuggestions.length >= SUGGESTION_LIMIT) break;

      if (selectedBreeds.includes(breed)) continue;

      if (fuzzySearch.test(breed.toLowerCase())) {
        breedSuggestions.push(breed);
      }
    }

    setBreedSuggestions(breedSuggestions);
  };

  const handleSearchChange = (event: InputEvent) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterSuggestions();
  };

  const handleSelectBreed = (breedToSelect: string) => () => {
    const selectedBreeds = filter?.breeds ?? [];
    selectedBreeds.push(breedToSelect);
    updateFilter({ breeds: selectedBreeds });
    setSearchTerm("");
    setBreedSuggestions([]);
  };

  const handleRemoveBreed = (breedToRemove: string) => () => {
    const filteredBreeds: Filter["breeds"] = (filter?.breeds ?? []).filter(
      (breed) => breed !== breedToRemove,
    );
    updateFilter({ breeds: filteredBreeds });
  };

  const renderBreedSuggestions = () =>
    breedSuggestions.map((breed) => (
      <div
        key={breed}
        className="p-2 cursor-pointer hover:bg-base-200"
        onClick={handleSelectBreed(breed)}
      >
        {breed}
      </div>
    ));

  return (
    <div className="p-4 space-y-4 relative">
      <input
        type="text"
        placeholder="Search Breeds"
        className="input input-bordered w-full"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {breedSuggestions.length > 0 && (
        <div className="absolute z-10 border rounded-lg shadow bg-base-100 max-h-60 overflow-y-auto">
          {renderBreedSuggestions()}
        </div>
      )}

      <div className="flex flex-wrap gap-1 space-y-1 max-h-50 overflow-y-auto hide-scrollbar">
        {(filter?.breeds ?? []).map((breed) => (
          <button
            key={breed}
            className="transition-colors duration-200 group btn btn-primary btn-soft hover:btn-error w-full flex justify-between items-center"
            onClick={handleRemoveBreed(breed)}
            title={breed}
          >
            <span className="truncate flex-1 text-center">{breed}</span>
            <span className="text-neutral group-hover:text-error ml-2 shrink-0">
              ✕
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BreedFilter;
