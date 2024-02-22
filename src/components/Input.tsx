import styled from "styled-components";
import { forwardRef, InputHTMLAttributes, ReactElement, Ref } from "react";

export interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  isopen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}
const Input = forwardRef(
  ({ ...props }: IInput, ref: Ref<HTMLInputElement>): ReactElement => {
    return <InputComponent {...props} ref={ref} />;
  }
);

const InputComponent = styled.input`
  border: 1px solid white;
  border-radius: 4px;
  background-color: #ccc;
`;

export default Input;
