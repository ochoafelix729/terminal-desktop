import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SmartFileGenerator from "./pages/SmartFileGenerator";

const App = () => {
    return (
       <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="smartfilegenerator" element={<SmartFileGenerator />} />
                <Route path="plugin2" element={<div>Plugin 2</div>} />
                <Route path="plugin3" element={<div>Plugin 3</div>} />
                <Route path="plugin4" element={<div>Plugin 4</div>} />
                <Route path="*" element={<div style={{ padding: 40 }}><h2>404 - Not Found</h2></div>} />
            </Routes>
       </Router>

    )
}

export default App;