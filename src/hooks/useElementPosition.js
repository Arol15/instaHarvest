import { useState, useEffect, useCallback } from "react";

/**
 *  useUploadImages
 * @see https://github.com/Arol15/instaHarvest/blob/master/API.md#useElementPosition
 *
 * ```
 * const [hasItemsOnLeft, hasItemsOnRight, scrollLeft, scrollRight] = useElementPosition(ref);
 * ```
 */

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
      const currVisibleElems = Array.from(elem.children).filter((child) => {
        const childPosition = child.getBoundingClientRect();

        return (
          childPosition.left >= elemPosition.left &&
          childPosition.right <= elemPosition.right
        );
      });
      if (currVisibleElems.length > 0) {
        setPrevElem(getPreviousElem(currVisibleElems));
        setNextElem(getNextElem(currVisibleElems));
      }
    };

    update();

    elem.addEventListener("scroll", update, { passive: true });

    ref.current.scroll({
      left: -20,
      behavior: "smooth",
    });

    return () => {
      elem.removeEventListener("scroll", update, { passive: true });
    };
  }, [ref]);

  const hasElemOnLeft = prevElem !== null;
  const hasElemOnRight = nextElem !== null;

  return {
    hasElemOnLeft,
    hasElemOnRight,
    scrollLeft,
    scrollRight,
  };
};

export default useElementPosition;
