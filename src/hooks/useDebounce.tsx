import { useState, useEffect } from "react";

function useDebounce(value: any, delay = 300) {
  const [debouncedValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    // effect 返回一个函数，React 会在执行当前 effect 之前对上一个 effect 进行清除
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default useDebounce;
