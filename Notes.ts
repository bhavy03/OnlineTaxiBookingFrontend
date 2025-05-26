// useEffect return function is a cleanup function.

// ref LocationEntering.tsx
// 1. User types → State changes → Component re-renders.
// 2. useEffect runs:
//     a. It first clears the previous timer using cleanup.
//     b. It then sets a new timer.
// 3. If user stops typing → latest timer finishes → API call is made.
// 4. If user types again quickly → old timer is cancelled.
// Analogy:
// It's like this:
// You type “Pizza”
// The app waits 2 seconds before sending the request
// If you type again before 2 seconds — it cancels the previous timer and restarts
// That’s exactly what debounce is.

// in locationEntering.tsx for dobouncedPickup and debouncedDrop
// const { data: pickupSuggestions, refetch: refetchPickup } =
// useEffect(() => {
//   const timeout = setTimeout(() => {
//     if (debouncedPickup.trim()) {
//       refetchPickup();
//     }
//   }, 1000);

//   return () => clearTimeout(timeout);
// }, [debouncedPickup, refetchPickup]);

// in driverAvailability.tsx
// we have created useRef for connectionRef and locationIntervalRef
// because we want to keep the same reference for the connection and interval
// across renders and avoid re-creating them unnecessarily.
// re render may occur because of parent component re-rendering
// although we have used useEffect to manage the connection and interval.
// not possible to use useState, const ,usecallback
// because they will create new references on every render.
