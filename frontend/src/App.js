import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import SignUp from "./auth/SignUp";
import SignIn from "./auth/SignIn";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<HomeLayout />} />
      </Routes>
    </Router>
  );
};

export default App;