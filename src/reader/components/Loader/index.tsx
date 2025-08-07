import classes from "./style.module.css";
import gsap, { Linear } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(DrawSVGPlugin);

const Loader = () => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const timeLine = gsap.timeline();

    timeLine.to(loaderRef.current, {
      rotation: "360",
      ease: Linear.easeNone,
      repeat: -1,
    });

    timeLine.to(loaderRef.current, {
      border: "48px dotted blue",
      duration: 30,
      ease: Linear.easeNone,
      repeat: -1,
    });
  });

  return <div className={classes.loader} ref={loaderRef} />;
};

export default Loader;
