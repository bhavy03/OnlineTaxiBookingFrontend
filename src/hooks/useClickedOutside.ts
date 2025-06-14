import { useEffect } from "react";
import type { RefObject } from "react";

type UseClickOutsideCallback = () => void;

export function useClickOutside<T extends HTMLDivElement | null>(
  refs: Array<RefObject<T>>,
  callback: UseClickOutsideCallback
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = refs.every((ref) => {
        const el = ref.current;
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
