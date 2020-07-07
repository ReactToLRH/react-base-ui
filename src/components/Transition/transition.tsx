import React from "react";
import { CSSTransition } from "react-transition-group";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";

type AnimationName =
  | "zoom-in-top"
  | "zoom-in-left"
  | "zoom-in-bottom"
  | "zoom-in-right";

interface TransitionProps extends CSSTransitionProps {
  animation?: AnimationName;
  wrapper?: boolean; // 是否在外层包裹一层节点，避免transition冲突
}

const Transition: React.FC<TransitionProps> = (props) => {
  const { children, classNames, animation, wrapper, ...restProps } = props;
  return (
    <CSSTransition
      classNames={classNames ? classNames : animation}
      {...restProps}
    >
      {wrapper ? <div>{children}</div> : children}
    </CSSTransition>
  );
};

Transition.defaultProps = {
  /**
   * 默认情况下，子组件在达到“退出”状态后仍然挂载。
   * 如果希望在组件退出后卸载组件,则可以设置 unmountOnExit。
   * 可用于设置了 display: none 的节点，解决动画不起作用的问题
   */
  unmountOnExit: true,
  /** 
   * 默认情况下，子组件在第一次挂载时不执行enter转换，而与in的值无关。如果您想要此行为，请同时将appear和in设置为true。
   */
  appear: true,
};

export default Transition;
