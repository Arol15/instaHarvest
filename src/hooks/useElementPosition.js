import { useState, useEffect, useCallback } from "react";
import reactDom from "react-dom";

const useElementPosition = (ref) => {
  const [prevElem, setPrevElem] = useState(null);
  const [nextElem, setNextElem] = useState(null);

  const getPreviousElem = (list) => {
    const sibling = list[0].previousElementSibling;
    if (sibling instanceof HTMLElement) {
      return sibling;
    }
    return sibling;
  };

  const getNextElem = (list) => {
    const sibling = list[list.length - 1].nextElementSibling;
    if (sibling instanceof HTMLElement) {
      return sibling;
    }
    return null;
  };

  const scrollToElem = useCallback(
    (elem) => {
      const currentNode = ref.current;

      if (!currentNode || !elem) {
        return;
      }

      let newScrollPosition;

      newScrollPosition =
        elem.offsetLeft +
        elem.getBoundingClientRect().width / 2 -
        currentNode.getBoundingClientRect().width / 2;

      currentNode.scroll({
        left: newScrollPosition,
        behavior: "smooth",
      });
    },
    [ref]
  );

  const scrollRight = useCallback(() => scrollToElem(nextElem), [
    scrollToElem,
    nextElem,
  ]);

  const scrollLeft = useCallback(() => scrollToElem(prevElem), [
    scrollToElem,
    prevElem,
  ]);

  useEffect(() => {
    const elem = ref.current;
    const update = () => {
      const elemPosition = elem.getBoundingClientRect();
      const visibleElems = Array.from(elem.children).filter((child) => {
        const childPosition = child.getBoundingClientRect();

        return (
          childPosition.left >= elemPosition.left &&
          childPosition.right <= elemPosition.right
        );
      });
      if (visibleElems.length > 0) {
        setPrevElem(getPreviousElem(visibleElems));
        setNextElem(getNextElem(visibleElems));
      }
    };

    update();
    elem.addEventListener("scroll", update, { passive: true });

    return () => {
      elem.removeEventListener("scroll", update, { passive: true });
    };
  }, [ref]);

  const hasItemsOnLeft = prevElem !== null;
  const hasItemsOnRight = nextElem !== null;

  return [hasItemsOnLeft, hasItemsOnRight, scrollLeft, scrollRight];
};

export default useElementPosition;
