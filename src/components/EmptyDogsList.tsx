import { Frown } from "lucide-react";
import { useDogStore } from "../stores/dog.ts";

const EmptyDogsList = () => {
  const updateFilter = useDogStore((state) => state.updateFilter);

  const clearFilters = () => {
    updateFilter({ zipCodes: [], breeds: [], ageMax: 20, ageMin: 0 });
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-6">
      <Frown className="w-16 h-16 text-base-content/50" />
      <p className="text-lg font-semibold text-base-content">No dogs found</p>
      <p className="text-sm text-base-content/70">Try adjusting your filters</p>
      <button className="btn btn-primary mt-4" onClick={clearFilters}>
        Reset Filters
      </button>
    </div>
  );
};

export default EmptyDogsList;
