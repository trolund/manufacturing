import { useState } from "react";

type TriStateSelectorProps<T extends object, K extends keyof T = keyof T> = {
  initial: T;
  callback?: (state: number) => void;
};

const TriStateSelector = <T extends object, K extends keyof T = keyof T>({
  initial,
  callback,
}: TriStateSelectorProps<T>) => {
  const [state, setState] = useState<T>(initial);

  const keys = Object.keys(initial);

  return (
    <div className="p-24 flex items-center justify-center">
      <div className="inline-flex overflow-hidden border border-gray-200 rounded-lg">
        {keys.map((key) => (
          <label htmlFor={key} className="cursor-pointer">
            <input
              type="radio"
              name="worktype"
              id={key}
              className="sr-only peer"
              checked
            />
            <span className="relative inline-flex items-center h-full py-2 pr-3 space-x-2 text-sm pl-7 peer-checked:bg-blue-200">
              <span className="before:w-2 before:h-2 before:bg-blue-500 before:rounded-full before:absolute before:top-[14px] before:left-3">
                {key}
              </span>
            </span>
          </label>
        ))}
        {/* <label htmlFor="work" className="cursor-pointer">
          <input
            type="radio"
            name="worktype"
            id="work"
            className="sr-only peer"
            checked
          />
          <span className="relative inline-flex items-center h-full py-2 pr-3 space-x-2 text-sm pl-7 peer-checked:bg-blue-200">
            <span className="before:w-2 before:h-2 before:bg-blue-500 before:rounded-full before:absolute before:top-[14px] before:left-3">
              Work
            </span>
          </span>
        </label>
        <label htmlFor="school" className="cursor-pointer">
          <input
            type="radio"
            name="worktype"
            id="school"
            className="sr-only peer"
          />
          <span className="relative inline-flex items-center h-full py-2 pr-3 space-x-2 text-sm pl-7 peer-checked:bg-green-200">
            <span className="before:w-2 before:h-2 before:bg-green-500 before:rounded-full before:absolute before:top-[14px] before:left-3">
              School
            </span>
          </span>
        </label>
        <label htmlFor="private" className="cursor-pointer">
          <input
            type="radio"
            name="worktype"
            id="private"
            className="sr-only peer"
          />
          <span className="relative inline-flex items-center h-full py-2 pr-3 space-x-2 text-sm pl-7 peer-checked:bg-indigo-200">
            <span className="before:w-2 before:h-2 before:bg-indigo-500 before:rounded-full before:absolute before:top-[14px] before:left-3">
              Private
            </span>
          </span>
        </label> */}
      </div>
    </div>
  );
};

export default TriStateSelector;
