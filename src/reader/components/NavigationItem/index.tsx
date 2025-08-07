import classes from "./style.module.css";
import type { TNavigationItemProps } from "./types";
import { getBorderColor } from "./utils";

const NavigationItem = ({
  item,
  handleSetChapter,
  level = 0,
}: TNavigationItemProps) => {
  return (
    <div
      className={classes.navigationItem}
      onClick={handleSetChapter(item.src, item.playOrder)}
      style={{
        borderBottomColor: getBorderColor(level),
      }}
    >
      <span className={classes.text}>
        {item?.label?.replace("Chapter", "Ch.")}
      </span>
    </div>
  );
};

export default NavigationItem;
