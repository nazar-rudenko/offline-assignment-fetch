import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import BreedFilter from "./BreedFilter.tsx";
import AgeSelector from "./AgeSelector.tsx";
import ZipFilter from "./ZipFilter.tsx";

const SearchPanel = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="md:w-64 border-b md:border-r border-base-300 bg-base-200 min-w-[300px]">
      <div
        className="flex items-center justify-between p-4 md:hidden cursor-pointer"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
      >
        <span className="font-bold">Search</span>
        {isSearchOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </div>
      <aside
        className={`overflow-hidden transition-all duration-300 md:block 
        ${isSearchOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"} 
        space-y-4 md:max-h-none md:opacity-100`}
      >
        <div className="p-4 pt-0 md:pt-4">
          <div className="divider">Breeds</div>
          <BreedFilter />
          <div className="divider">Age</div>
          <AgeSelector />
          <div className="divider">Zip</div>
          <ZipFilter />
        </div>
      </aside>
    </div>
  );
};

export default SearchPanel;
