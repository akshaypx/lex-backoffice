import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Questions from "./pages/Questions/Questions";
import Gemini from "./pages/Gemini/Gemini";
import MainPage from "./pages/Gemini/MainPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App>
        <Dashboard />
      </App>
    ),
  },
  {
    path: "/questions",
    element: (
      <App>
        <Questions />
      </App>
    ),
  },
  {
    path: "/configurations",
    element: (
      <App>
        <h1>Page Coming Soon !</h1>
      </App>
    ),
  },
  {
    path: "/user-management",
    element: (
      <App>
        <h1>Page Coming Soon !</h1>
      </App>
    ),
  },
  {
    path: "/gemini",
    element: (
      <App>
        <MainPage />
      </App>
    ),
  },
  {
    path: "*",
    element: (
      <App>
        <div
          style={{
            margin: "20px",
          }}
        >
          <h2>Oops, Page Not Found</h2>
        </div>
      </App>
    ),
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  <PrimeReactProvider>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </PrimeReactProvider>
  // </React.StrictMode>
);
