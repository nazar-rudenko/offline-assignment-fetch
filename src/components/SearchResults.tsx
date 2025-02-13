import { useEffect, useState, useRef } from "react";
import { useDogStore, PAGE_SIZE } from "../stores/dog.ts";
import SortControls from "./SortControls.tsx";
import Pagination from "./Pagination.tsx";
import DogCard from "./DogCard.tsx";
import DogCardSkeleton from "./DogCardSkeleton.tsx";
import EmptyDogsList from "./EmptyDogsList.tsx";

const THROTTLE_MS = 400;
let throttleTimerId: number;

const SearchResults = () => {
  const { sort, filter, page, searchDogs, dogs } = useDogStore();
  const [isLoading, setIsLoading] = useState(false);
  const isFirstRender = useRef(true);

  const execRequest = async () => {
    setIsLoading(true);
    await searchDogs();
    setIsLoading(false);
  };

  const fetchDogs = ({ withThrottle = true } = {}) => {
    if (throttleTimerId) {
      clearTimeout(throttleTimerId);
    }

    if (withThrottle) {
      throttleTimerId = setTimeout(execRequest, THROTTLE_MS);
      return;
    }
    void execRequest();
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      fetchDogs({ withThrottle: false });

      return;
    }

    fetchDogs();

    return () => {
      if (throttleTimerId) {
        clearTimeout(throttleTimerId);
      }
    };
  }, [sort, filter, page]);

  const skeletonIterator = new Array(PAGE_SIZE).fill(undefined);

  return (
    <section className="flex-grow p-4 space-y-4">
      <SortControls />
      {dogs.length === 0 && !isLoading && <EmptyDogsList />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? skeletonIterator.map((_, index) => <DogCardSkeleton key={index} />)
          : dogs.map((dog) => <DogCard key={dog.id} dog={dog} />)}
        {}
      </div>
      <Pagination />
    </section>
  );
};

export default SearchResults;
