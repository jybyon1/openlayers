import styled from "styled-components";
import MainPage from "./page/MainPage";
import Map from "./map/Map";

function App() {
  return (
    <ComponentWrapper>
      <Map>
        <MainPage />
      </Map>
    </ComponentWrapper>
  );
}

const ComponentWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

export default App;
