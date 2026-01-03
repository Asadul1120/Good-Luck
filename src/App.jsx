
import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Outlet /> {/* এখানে চাইল্ড রাউট রেন্ডার হবে */}
      </main>
      {/* আপনি চাইলে Footer এখানে যোগ করতে পারেন */}
    </div>
  );
}

export default App;