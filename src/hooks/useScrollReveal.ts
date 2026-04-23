import { useEffect, useRef } from "react";

export function useScrollReveal(staggerDelay = 0.1) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll("[data-reveal]");
    if (children.length === 0) {
      el.style.opacity = "0";
      el.style.transform = "translateY(40px)";
      el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`;
    } else {
      children.forEach((child, i) => {
        const htmlChild = child as HTMLElement;
        htmlChild.style.opacity = "0";
        htmlChild.style.transform = "translateY(40px)";
        htmlChild.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * staggerDelay}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * staggerDelay}s`;
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (children.length === 0) {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            } else {
              children.forEach((child) => {
                const htmlChild = child as HTMLElement;
                htmlChild.style.opacity = "1";
                htmlChild.style.transform = "translateY(0)";
              });
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [staggerDelay]);

  return ref;
}
