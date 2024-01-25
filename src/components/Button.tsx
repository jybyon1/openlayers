import { ReactNode } from "react";
import styled from "styled-components";
import { center } from "../styles/map.styled";

interface ButtonProps {
  text?: string;
  icon?: ReactNode;
  length?: string;
  active?: boolean;
  onClick?: () => void;
}

export const Button = (props: ButtonProps) => {
  const { text, icon, length = "", active = false, onClick } = props;
  return (
    <ComponentWrapper onClick={onClick}>
      <ButtonWrapper $length={length} $active={active ? "true" : "false"}>
        {icon}
        {text}
      </ButtonWrapper>
    </ComponentWrapper>
  );
};

const ComponentWrapper = styled.div`
  z-index: 999;
`;

const ButtonWrapper = styled.button<{
  $length: string;
  $active: "true" | "false";
}>`
  ${center}
  width: ${({ $length }) => ($length ? $length : "24px")};
  height: ${({ $length }) => ($length ? $length : "24px")};
  border-radius: 4px;
  border: none;
  background-color: ${({ $active }) => ($active === "true" ? "#ccc" : "#fff")};
  cursor: pointer;
  &:active,
  &:focus {
    background-color: #ccc;
  }
`;
