import { ChangeEvent, useState } from "react";
import { useDogStore } from "../stores/dog";

const ZipFilter = () => {
  const { updateFilter, filter } = useDogStore();
  const [zipInput, setZipInput] = useState("");

  const handleZipInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setZipInput(value);
  };

  const addZipCodes = () => {
    const current = filter?.zipCodes ?? [];
    const newZipCodes = zipInput
      .split(",")
      .map((zip) => zip.trim())
      .filter((zip) => /^\d{5}(-\d{4})?$/.test(zip));

    const uniqueZipCodesSet = new Set([...current, ...newZipCodes]);

    if (uniqueZipCodesSet.size === current.length) return;

    setZipInput("");
    updateFilter({ zipCodes: Array.from(uniqueZipCodesSet) });
  };

  const removeZipCode = (zipToRemove: string) => () => {
    if (!filter?.zipCodes) return;

    const currentZipCodes = filter.zipCodes ?? [];
    const filteredZipCodes = currentZipCodes.filter(
      (zip) => zip !== zipToRemove,
    );

    updateFilter({
      zipCodes: filteredZipCodes,
    });
  };

  return (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Zip Codes"
          className="input input-bordered flex-grow"
          value={zipInput}
          onChange={handleZipInput}
        />
        <button className="btn btn-primary" onClick={addZipCodes}>
          +
        </button>
      </div>
      <div className="flex flex-wrap pt-4 gap-1 space-y-1 max-h-50 overflow-y-auto hide-scrollbar">
        {filter.zipCodes?.map((zip) => (
          <button
            onClick={removeZipCode(zip)}
            key={zip}
            className="transition-colors duration-200 group flex justify-between items-center cursor-pointer badge badge-primary badge-soft hover:badge-error gap-2"
          >
            {zip}
            <span className="text-neutral group-hover:text-error">✕</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default ZipFilter;
