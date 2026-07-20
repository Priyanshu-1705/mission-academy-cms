import { useEffect } from "react";

export default function usePageTitle(page) {
  useEffect(() => {
    document.title = page
      ? `${page} | Mission Academy`
      : "Mission Academy";
  }, [page]);
}