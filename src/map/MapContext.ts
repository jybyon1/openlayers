import { createContext } from "react";

import { Map as OlMap } from "ol";

const MapContext = createContext<{ map: OlMap | undefined }>({
  map: undefined,
});

export default MapContext;
