import { BrowserRouter as Router } from "react-router-dom";

import Header from "./components/Header";

import { AuthProvider } from "./contexts/authContext";
import AppRoutes from "./routes/routes";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
