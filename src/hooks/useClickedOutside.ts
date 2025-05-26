import { useEffect } from "react";
import type { RefObject } from "react";

type UseClickOutsideCallback = () => void;

export function useClickOutside<T extends HTMLDivElement | null>(
  refs: Array<RefObject<T>>,
  callback: UseClickOutsideCallback
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
    //   console.log("Refs count:", refs.length);

      const isOutside = refs.every((ref) => {
        const el = ref.current;
        // console.log("el", el, event.target);
        return el && !el.contains(event.target as Node);
      });

      if (isOutside) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
}
