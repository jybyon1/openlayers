import styled from "styled-components";
import { forwardRef, ReactElement, Ref } from "react";

const Input = forwardRef((ref: Ref<HTMLInputElement>): ReactElement | null => {
  return (
    <ComponentWrapper ref={ref}>
      <InputComponent />
    </ComponentWrapper>
  );
});

const ComponentWrapper = styled.div`
  width: 100px;
  height: 20px;
`;

const InputComponent = styled.input`
  border: 1px solid white;
  border-radius: 4px;
  background-color: #ccc;
`;

export default Input;
