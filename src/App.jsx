
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App ">
      <Header />
      <main>
        <ToastContainer />
        <Outlet /> {/* এখানে চাইল্ড রাউট রেন্ডার হবে */}
      </main>
      <Footer />
    </div>
  );
}

export default App;