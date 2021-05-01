import { useState, useEffect } from "react";

/**
 *  useScreen
 * @see https://github.com/Arol15/instaHarvest/blob/master/API.md#useScreen
 *
 * ```
 * const {isDesktop, screenWidth, screenHeight} = useScreen(breakpoint);
 * ```
 */

const useScreen = (breakpoint = 600) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [isDesktop, setDesktop] = useState(window.innerWidth >= breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isDesktop && width < breakpoint) {
      setDesktop(false);
    } else if (!isDesktop && width >= breakpoint) {
      setDesktop(true);
    }
  }, [width]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isDesktop, screenWidth: width, screenHeight: height };
};

export default useScreen;
