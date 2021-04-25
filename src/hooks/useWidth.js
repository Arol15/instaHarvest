import { useState, useEffect } from "react";

/**
 *  useUploadImages
 * @see https://github.com/Arol15/instaHarvest/blob/master/API.md#useWidth
 *
 * ```
 * const [isDesktop] = useWidth(breakpoint);
 * ```
 */

const useWidth = (breakpoint = 600) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [isDesktop, setDesktop] = useState(window.innerWidth >= breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
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
  return isDesktop;
};

export default useWidth;
