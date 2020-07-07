import React, { FC, useState, createContext, CSSProperties } from "react";
import classNames from "classnames";
import { MenuItemProps } from "./menuItem";

type MenuMode = "horizontal" | "vertical"; // 字符串字面量类型 - 菜单栏类型：水平（horizontal）/垂直（vertical）
export interface MenuProps {
  /** 默认 active 的菜单栏的索引值 */
  defaultIndex?: string;
  className?: string;
  /** 菜单栏类型：水平/垂直 */
  mode?: MenuMode;
  style?: React.CSSProperties;
  /** 点击菜单触发的回调函数 */
  onSelect?: (selectedIndex: string) => void;
  /** 设置子菜单的默认打开（纵向模式下生效） */
  defaultOpenSubMenus?: string[];
}

/** 菜单栏传递给子组件参数 */
interface IMenuContext {
  index: string;
  onSelect?: (selectedIndex: string) => void;
  mode?: MenuMode;
  defaultOpenSubMenus?: string[];
}

/**
 * 创建一个 Context 对象。
 * 当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 Provider 中读取到当前的 context 值。
 */
export const MenuContext = createContext<IMenuContext>({ index: "0" });

/**
 * 为网站提供导航功能的菜单。支持横向纵向两种模式，支持下拉菜单。
 * 
 * ~~~js
 * import { Menu } from 'vikingship'
 * ~~~
 */
export const Menu: FC<MenuProps> = (props) => {
  const {
    className,
    mode,
    style,
    children,
    defaultIndex,
    onSelect,
    defaultOpenSubMenus,
  } = props;
  const [currentActive, setActive] = useState(defaultIndex);
  const classes = classNames("viking-menu", className, {
    "menu-vertical": mode === "vertical",
    "menu-horizontal": mode !== "vertical",
  });
  /** 选择菜单栏回调函数 */
  const handleClick = (index: string) => {
    setActive(index);
    if (onSelect) {
      onSelect(index);
    }
  };
  /** 菜单栏传递给子组件参数 */
  const passedContext: IMenuContext = {
    index: currentActive ? currentActive : "0", // 当前选择菜单栏索引 index
    onSelect: handleClick, // 选择菜单栏回调函数
    mode, // 菜单栏类型：水平（horizontal）/垂直（vertical）
    defaultOpenSubMenus, // 设置子菜单的默认打开
  };
  /** 渲染子组件 */
  const renderChildren = () => {
    /**
     * React.Children 提供了用于处理 this.props.children 不透明数据结构的实用方法。
     * React.Children.map
     * >>> 在 children 里的每个直接子节点上调用一个函数，并将 this 设置为 thisArg。
     * >>> 如果 children 是一个数组，它将被遍历并为数组中的每个子节点调用该函数。
     * >>> 如果子节点为 null 或是 undefined，则此方法将返回 null 或是 undefined，而不会返回数组。
     * >>> 【注意】如果 children 是一个 Fragment 对象，它将被视为单一子节点的情况处理，而不会被遍历。
     */
    return React.Children.map(children, (child, index) => {
      /** 
       * TypeScript知识点：
       * 类型断言（Type assertions）：通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 
       */
      const childElement = child as React.FunctionComponentElement<
        MenuItemProps
      >;
      const { displayName } = childElement.type; // 获取组件名
      if (displayName === "MenuItem" || displayName === "SubMenu") {
        /** 
         * React.cloneElement(element, [props], [...children])
         * 以 element 元素为样板克隆并返回新的 React 元素。返回元素的 props 是将新的 props 与原始元素的 props 浅层合并后的结果。
         * 等同于 <element.type {...element.props} {...props}>{children}</element.type>
         */
        return React.cloneElement(childElement, {
          index: index.toString(),
        });
      } else {
        console.error(
          "Warning: Menu has a child which is not a MenuItem component"
        );
      }
    });
  };
  return (
    <ul className={classes} style={style} data-testid="test-menu">
      {/* 每个 Context 对象都会返回一个 Provider React 组件，它允许消费组件订阅 context 的变化。 */}
      {/* Provider 接收一个 value 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。 */}
      <MenuContext.Provider value={passedContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  );
};

Menu.defaultProps = {
  defaultIndex: "0",
  mode: "horizontal",
  defaultOpenSubMenus: [],
};

export default Menu;
