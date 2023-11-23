import { RefObject, useEffect } from "react";

type Event = MouseEvent | TouchEvent;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
      if (!el || el.contains((event.target as Node) || null)) {
        return; // if click inside ref's element, do nothing
      }

      handler(event); // call the handler only if click outside ref's element
    };

    document.addEventListener("mousedown", listener); // on Desktop
    document.addEventListener("touchstart", listener); // on Mobile

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};
