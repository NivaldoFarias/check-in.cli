import { RefObject, useEffect } from "react";

export function useLoadPageOpacity(pageRef: RefObject<HTMLDivElement>) {
  useEffect(() => {
    setTimeout(() => {
      if (
        pageRef.current &&
        !pageRef.current.classList.contains("has-loaded")
      ) {
        pageRef.current.classList.add("has-loaded");
      }
    }, 100);
  }, []);
}
