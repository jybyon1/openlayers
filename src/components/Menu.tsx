import { ReactNode, RefObject, useEffect, useRef } from "react";
import styled from "styled-components";

import { handleOutsideMenuClick } from "../utils/menu";

interface IMenu {
  children?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLElement>;
}
const Menu = ({ children, isOpen, onClose, triggerRef }: IMenu) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mouseDownEventListner = (e: MouseEvent) =>
      handleOutsideMenuClick(e, onClose, menuRef, triggerRef);
    document.addEventListener("mousedown", mouseDownEventListner);

    return () => {
      document.removeEventListener("mousedown", mouseDownEventListner);
    };
  }, [onClose, triggerRef]);

  return (
    <ComponentWrapper ref={menuRef} $show={isOpen ? "true" : "false"}>
      {children}
    </ComponentWrapper>
  );
};

const ComponentWrapper = styled.div<{ $show: "true" | "false" }>`
  position: absolute;
  display: ${({ $show }) => ($show === "true" ? "block" : "none")};
  background-color: #fff;
  position: absolute;
  z-index: 1;
  border: 4px;
`;

export default Menu;
