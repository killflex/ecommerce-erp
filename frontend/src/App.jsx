import { Outlet } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navigation from "./pages/Auth/Navigation";

function App() {
  return (
    <>
      <Navigation />
      <main className="py-3">
        <Outlet />
      </main>
      <ToastContainer />
    </>
  );
}

export default App;
