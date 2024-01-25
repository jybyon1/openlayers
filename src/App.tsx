import styled from "styled-components";
import MainPage from "./page/MainPage";

function App() {
  return (
    <ComponentWrapper>
      <MainPage />
    </ComponentWrapper>
  );
}

const ComponentWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

export default App;
