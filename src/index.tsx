import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import { AuthUser, SelectUser } from "./store/action-creators/userActions";
import { getAccessToken, getSelectedUser } from "./services/api-user-service";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const token = getAccessToken();
if (token) {
  AuthUser(token, "Loaded from localStorrage", store.dispatch);
}

const selectedUser = getSelectedUser();
if (selectedUser) {
  SelectUser(selectedUser, store.dispatch);
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ToastContainer autoClose={5000} />
      <App />
    </BrowserRouter>
  </Provider>
);
