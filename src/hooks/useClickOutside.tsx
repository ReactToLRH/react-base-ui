import { RefObject, useEffect } from 'react'

function useClickOutside (ref: RefObject<HTMLElement>, handler: Function) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // contains 用于判断指定元素内是否包含另一个元素
      // target 可返回事件的目标节点(触发该事件的节点)
      if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
        return
      }
      handler(event)
    }
    document.addEventListener('click', listener)
    return () => {
      document.removeEventListener('click', listener)
    }
  }, [ref, handler])
}

export default useClickOutside
