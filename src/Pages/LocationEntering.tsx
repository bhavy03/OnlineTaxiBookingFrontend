import { FaLocationDot } from "react-icons/fa6";
import { FaRegDotCircle } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useState, useRef } from "react";
import { useDebounce } from "use-debounce";
import { useAppDispatch } from "../store/hooks";
import { setSlicePickUp, setSliceDrop } from "../features/locationSlice";
import toast from "react-hot-toast";
import { useGetAutocompleteQuery } from "../services/LocationIQAPI";
import { v4 as uuidv4 } from "uuid";
import type { Suggestion } from "../types/Suggestion";
import { useClickOutside } from "../hooks/useClickedOutside";

function LocationEntering() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const [suggestedPickup, setSuggestedPickup] = useState<Suggestion | null>(
    null
  );
  const [suggestedDrop, setSuggestedDrop] = useState<Suggestion | null>(null);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropSuggestions, setShowDropSuggestions] = useState(false);

  const [selected, setSelected] = useState(false);

  const pickupRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [debouncedPickup] = useDebounce(pickup, 200);
  const [debouncedDrop] = useDebounce(drop, 200);

  const { data: pickupSuggestions } = useGetAutocompleteQuery(debouncedPickup, {
    skip: !debouncedPickup.trim(),
  });
  const { data: dropSuggestions } = useGetAutocompleteQuery(debouncedDrop, {
    skip: !debouncedDrop.trim(),
  });

  useClickOutside([pickupRef, dropRef], () => {
    setShowPickupSuggestions(false);
    setShowDropSuggestions(false);
  });

  const handleClick = () => {
    const authenticated = localStorage.getItem("taxiToken") ? true : false;
    if (!authenticated) {
      toast.error("Please login to book a ride");
      navigate("login");
      return;
    }

    if (!pickup.trim() || !drop.trim()) {
      toast.error("Please enter both pickup and drop locations");
      return;
    }
    if (pickup === drop) {
      toast.error("Pickup and drop locations cannot be the same");
      return;
    }
    if (!selected) {
      toast.error(
        "Please select a pickup and drop location from the suggestions"
      );
      return;
    }
    const pickupLat = suggestedPickup?.lat;
    const pickupLon = suggestedPickup?.lon;
    const dropLat = suggestedDrop?.lat;
    const dropLon = suggestedDrop?.lon;
    // if (
    //   pickupLat !== undefined &&
    //   pickupLon !== undefined &&
    //   dropLat !== undefined &&
    //   dropLon !== undefined
    // ) {
      navigate(`/book-ride/${pickupLat}/${pickupLon}/${dropLat}/${dropLon}`);
    // } else {
    //   console.error("One or more coordinates are missing for booking.");
    //   navigate("/"); 
    // }
  };

  const handlePickupSuggestionClick = (suggestion: Suggestion) => {
    setPickup(suggestion?.display_name);
    setSuggestedPickup(suggestion);
    dispatch(setSlicePickUp(suggestion));
    setShowPickupSuggestions(false);
    setSelected(true);
  };

  const handleDropSuggestionClick = (suggestion: Suggestion) => {
    setDrop(suggestion?.display_name);
    setSuggestedDrop(suggestion);
    dispatch(setSliceDrop(suggestion));
    setShowDropSuggestions(false);
    setSelected(true);
  };

  return (
    <div className="max-w-md mx-auto mt-10 relative">
      <div className="text-3xl font-bold mb-4">Bharat Moves on Rapido</div>

      <div className="flex flex-col gap-5 mb-3">
        <div ref={pickupRef} className="relative">
          <div className="flex items-center border border-gray-300 px-3 py-1 rounded">
            <FaLocationDot size={22} className="text-gray-600" />
            <input
              type="text"
              className="p-2 w-full outline-none"
              placeholder="Enter Pickup Location"
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
                setShowPickupSuggestions(true);
              }}
            />
          </div>

          {showPickupSuggestions && pickupSuggestions?.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 w-full mt-1 max-h-40 overflow-y-auto z-10">
              {pickupSuggestions.map((suggestion: Suggestion) => (
                <li
                  key={uuidv4()}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handlePickupSuggestionClick(suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div ref={dropRef} className="relative">
          <div className="flex items-center border border-gray-300 px-3 py-1 rounded">
            <FaRegDotCircle size={22} className="text-gray-600" />
            <input
              type="text"
              className="p-2 w-full outline-none"
              placeholder="Enter Drop Location"
              value={drop}
              onChange={(e) => {
                setDrop(e.target.value);
                setShowDropSuggestions(true);
              }}
            />
          </div>

          {showDropSuggestions && dropSuggestions?.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 w-full mt-1 max-h-40 overflow-y-auto z-10">
              {dropSuggestions.map((suggestion: Suggestion) => (
                <li
                  key={uuidv4()}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleDropSuggestionClick(suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <button className="flex w-full" onClick={handleClick}>
        <span className="w-full bg-amber-400 rounded p-3 text-center font-semibold">
          Book Ride
        </span>
      </button>
    </div>
  );
}

export default LocationEntering;

// 26.9291996
// 75.703282
// 26.9181132
// 75.790129
