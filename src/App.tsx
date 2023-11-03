import { useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Header from "./components/Header/Header";

interface AppProps {
  children: React.ReactNode;
}

function App({ children }: AppProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="parentContainer">
      <Header visible={visible} setVisible={setVisible} />
      <Navigation visible={visible} setVisible={setVisible} />
      <div className="App">{children}</div>
    </div>
  );
}

export default App;
