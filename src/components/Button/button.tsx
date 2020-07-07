import React, { FC, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import classNames from "classnames";

// TypeScript知识点：
// 字符串字面量类型:允许指定字符串必须的固定值
export type ButtonSize = "lg" | "sm";
export type ButtonType = "primary" | "default" | "danger" | "link";

interface BaseButtonProps {
  className?: string;
  /** 设置是否禁用 */
  disabled?: boolean;
  /** 设置尺寸 */ 
  size?: ButtonSize;
  /** 设置类型 */
  btnType?: ButtonType;
  children: React.ReactNode;
  href?: string;
}

// TypeScript知识点：
// Union Types（联合类型）：表示一个值可以是几种类型之一。 用竖线（ |）分隔每个类型
// Intersection Types（交叉类型）：将多个类型合并为一个类型。它包含了所需的所有类型的特性。用（ &）符号合并每个类型
// Partial：将一个已知的类型每个属性都变为可选的

// ButtonHTMLAttributes：button标签上的所有属性
// AnchorHTMLAttributes：a标签上的所有属性
type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>;
type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLElement>;
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;

/**
 * 页面中最常用的的按钮元素，适合于完成特定的交互
 * 
 * ~~~js
 * import { Button } from 'vikingship'
 * ~~~
 */
export const Button: FC<ButtonProps> = (props) => {
  const {
    btnType,
    className,
    disabled,
    size,
    children,
    href,
    ...restProps
  } = props;
  const classes = classNames("btn", className, {
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    'disable': (btnType === "link") && disabled,
  });
  if (btnType === "link" && href) {
    return (
      <a className={classes} href={href} {...restProps}>
        {children}
      </a>
    );
  } else {
    return (
      <button className={classes} disabled={disabled} {...restProps}>
        {children}
      </button>
    );
  }
};

Button.defaultProps = {
  disabled: false,
  btnType: "default",
};

export default Button;
