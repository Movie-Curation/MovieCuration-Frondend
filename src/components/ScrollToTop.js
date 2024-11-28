import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// 스크롤 맨 위로 올리는 컴포넌트
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}