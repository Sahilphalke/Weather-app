import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
// import WeatherUi from "../Components/WeatherUi";
import WeatherCard from "./Components/WeatherCard";
function App() {
  return (
    <>
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<WeatherUi />} />
        </Routes>
      </BrowserRouter> */}
      <WeatherCard />
    </>
  );
}

export default App;
