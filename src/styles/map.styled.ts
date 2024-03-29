import { css } from "styled-components";

export const controls = css`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1;
`;

export const topLeftControls = css`
  ${controls};
  top: 10px;
  left: 8px;
`;
export const topRightControls = css`
  ${controls};
  top: 10px;
  right: 10px;
`;
export const bottomLeftControls = css`
  ${controls};
  bottom: 10px;
  left: 10px;
`;
export const bottomRightControls = css`
  ${controls};
  bottom: 10px;
  right: 10px;
`;
