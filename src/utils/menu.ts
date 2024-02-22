export const handleOutsideMenuClick = (
  e: MouseEvent,
  onClose: () => void,
  containerRef: React.RefObject<HTMLDivElement>,
  triggerRef?: React.RefObject<HTMLElement>
) => {
  if (
    (!triggerRef &&
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)) ||
    (triggerRef &&
      containerRef.current &&
      !containerRef.current.contains(e.target as Node) &&
      triggerRef.current &&
      !triggerRef.current.contains(e.target as Node))
  ) {
    onClose();
  }
};
