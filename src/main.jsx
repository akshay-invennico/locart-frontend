import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./state/store";
import { UserProvider } from "./context/UserContext";
import { Toaster } from "sonner";
import App from "./App";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <UserProvider>
          <App />
          <Toaster />
        </UserProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
