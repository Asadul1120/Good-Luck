
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Outlet /> {/* এখানে চাইল্ড রাউট রেন্ডার হবে */}
      </main>
      <Footer />
    </div>
  );
}

export default App;