import React from "react";
import { FaRegDotCircle } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

interface EnteredLocationProps {
  pickupName: string;
  dropName: string;
}
const EnteredLocation = React.memo(
  ({ pickupName, dropName }: EnteredLocationProps) => {
    return (
      <div className="bg-blue-50 p-2 rounded-lg border border-blue-400 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-col items-center">
            <FaLocationDot color="green" size={18} className="mt-1" />
            {/* <hr className="border-l-2 border-dashed border-gray-300 h-4" /> */}
            <FaRegDotCircle color="red" size={16} className="mt-10" />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <span className="text-sm text-gray-800">{pickupName}</span>

            <hr className="border-t border-gray-300 w-full" />

            <span className="text-sm text-gray-800">{dropName}</span>
          </div>
        </div>
      </div>
    );
  }
);

export default EnteredLocation;
