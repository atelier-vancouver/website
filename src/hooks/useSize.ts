import useResizeObserver from "@react-hook/resize-observer";
import { useLayoutEffect, useState } from "react";

// from https://github.com/jaredLunde/react-hook/issues/165
export function useSize(): {
  ref: (node: HTMLDivElement | null) => void;
  size: DOMRect | undefined;
} {
  const [size, setSize] = useState<DOMRect | undefined>();
  const [node, ref] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    node !== null && setSize(node.getBoundingClientRect());
  }, [node]);

  // Where the magic happens
  useResizeObserver(node, (entry) => {
    setSize(entry.contentRect);
  });

  return { ref, size }; // this is also a little wierd since ref isn't a ref object but a setter function, but works if using it in the context of <div ref={ref}>
}
