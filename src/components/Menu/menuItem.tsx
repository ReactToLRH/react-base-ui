import React, { useContext } from "react";
import classNames from "classnames";
import { MenuContext } from "./menu";

export interface MenuItemProps {
  index?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { index, disabled, className, style, children } = props;
  /**
   * useContext
   * 接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值。
   * 当前的 context 值由上层组件中距离当前组件最近的 <MyContext.Provider> 的 value prop 决定。
   */
  const context = useContext(MenuContext);
  const classes = classNames("menu-item", className, {
    "is-disable": disabled,
    "is-active": context.index === index,
  });
  /** 菜单栏点击回调事件 */
  const handleClick = () => {
    if (context.onSelect && !disabled && typeof index === "string") {
      context.onSelect(index);
    }
  };
  return (
    <li className={classes} style={style} onClick={handleClick}>
      {children}
    </li>
  );
};

MenuItem.displayName = "MenuItem";

export default MenuItem;
