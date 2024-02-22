import { ButtonHTMLAttributes, ReactElement, Ref, forwardRef } from "react";
import styled from "styled-components";
import { center } from "../styles/common.styled";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const Button = forwardRef(
  (
    { children, active, ...props }: ButtonProps,
    ref: Ref<HTMLButtonElement>
  ): ReactElement => {
    return (
      <ComponentWrapper>
        <ButtonWrapper {...props} ref={ref} $active={active ? "true" : "false"}>
          {children}
        </ButtonWrapper>
      </ComponentWrapper>
    );
  }
);

const ComponentWrapper = styled.div`
  z-index: 999;
`;

const ButtonWrapper = styled.button<{
  $active: "true" | "false";
}>`
  ${center}
  padding: 0.3rem;
  border-radius: 4px;
  border: #adacac 0.5px solid;
  background-color: ${({ $active }) => ($active === "true" ? "#ccc" : "#fff")};
  cursor: pointer;
  &:active,
  &:focus {
    background-color: #ccc;
  }
`;
