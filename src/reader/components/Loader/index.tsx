import classes from "./style.module.css";

const Loader = () => {
  return <div className={classes.loader} role="status" aria-label="Loading" />;
};

export default Loader;
