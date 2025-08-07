import type { TNavigationBarProps } from "./types";
import classes from "./style.module.css";
import NavigationItems from "../NavigationItems";

const NavigationBar = ({ items, handleSetChapter }: TNavigationBarProps) => {
  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>
        <NavigationItems items={items} handleSetChapter={handleSetChapter} />
      </div>
    </div>
  );
};

export default NavigationBar;
