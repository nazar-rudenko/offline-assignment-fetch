import { ChangeEvent } from "react";
import { useDogStore, Sort } from "../stores/dog";

type SelectEvent = ChangeEvent<HTMLSelectElement>;

const SortControls = () => {
  const updateSort = useDogStore((state) => state.updateSort);
  const sort = useDogStore((state) => state.sort);

  const handleFieldChange = (event: SelectEvent) => {
    const field = event.target.value as Sort["field"];
    updateSort({ ...sort, field });
  };

  const handleOrderChange = (event: SelectEvent) => {
    const order = event.target.value as Sort["order"];
    updateSort({ ...sort, order });
  };

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Sort by:</label>
        <select
          className="select select-bordered select-sm"
          onChange={handleFieldChange}
          defaultValue={sort.field}
        >
          <option value="breed">Breed</option>
          <option value="name">Name</option>
          <option value="age">Age</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Order:</label>
        <select
          className="select select-bordered select-sm"
          onChange={handleOrderChange}
          defaultValue={sort.order}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
};

export default SortControls;
