import { ChangeEvent, useState } from "react";
import { useDogStore } from "../stores/dog";

type InputEvent = ChangeEvent<HTMLInputElement>;

const AgeSelector = () => {
  const { updateFilter, filter } = useDogStore();

  const [firstInput, setFirstInput] = useState(filter.ageMin);
  const [secondInput, setSecondInput] = useState(filter.ageMax);

  const updateRange = (values: [number, number]) => {
    const [min, max] = values.sort((a, b) => a - b);

    updateFilter({ ageMin: min, ageMax: max });
  };

  const handleFirstInput = (event: InputEvent) => {
    const newInput = Number(event.target.value);
    setFirstInput(newInput);
    updateRange([newInput, secondInput]);
  };

  const handleSecondInput = (event: InputEvent) => {
    const newInput = Number(event.target.value);
    setSecondInput(newInput);
    updateRange([newInput, firstInput]);
  };

  return (
    <>
      <div className="mb-0 relative w-full h-10 w-full">
        <input
          className="range double-range [--range-fill:0] w-full"
          type="range"
          min={0}
          max={20}
          value={firstInput}
          onChange={handleFirstInput}
        />
        <input
          className="range double-range [--range-fill:0] w-full"
          type="range"
          min={0}
          max={20}
          value={secondInput}
          onChange={handleSecondInput}
        />
      </div>
      <div className="flex justify-center">
        <span className="badge badge-soft badge-primary">
          {Math.min(firstInput, secondInput)} -{" "}
          {Math.max(firstInput, secondInput)}
        </span>
      </div>
    </>
  );
};

export default AgeSelector;
