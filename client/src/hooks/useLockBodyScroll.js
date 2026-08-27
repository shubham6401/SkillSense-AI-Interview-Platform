import { useEffect } from "react";

/**
 * Custom hook to lock body scrolling when a modal/popup/drawer is open.
 * Ensures the background page cannot be scrolled or bounced on mobile/touch devices.
 * 
 * @param {boolean} isLocked - Whether the body scroll should be locked.
 */
export function useLockBodyScroll(isLocked = true) {
    useEffect(() => {
        if (!isLocked) return;

        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.classList.add("modal-open");

        return () => {
            document.body.classList.remove("modal-open");
            if (originalStyle !== "hidden") {
                document.body.style.overflow = originalStyle;
            }
        };
    }, [isLocked]);
}

export default useLockBodyScroll;
