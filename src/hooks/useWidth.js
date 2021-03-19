import { useState, useEffect } from "react";

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
  }, [width]);
  return isDesktop;
};

export default useWidth;
