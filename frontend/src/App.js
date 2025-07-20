import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import SmartFileGenerator from "./pages/SmartFileGenerator";

const App = () => {
    return (
       <Router>
            <Routes>
                <Route path="/" element={<HomeLayout />} />
                <Route path="smart-file-generator" element={<SmartFileGenerator />} />
                <Route path="terminal-tutor" element={<div>Plugin 2</div>} />
                <Route path="plugin3" element={<div>Plugin 3</div>} />
                <Route path="plugin4" element={<div>Plugin 4</div>} />
                <Route path="*" element={<div style={{ padding: 40 }}><h2>404 - Not Found</h2></div>} />
            </Routes>
       </Router>

    )
}

export default App;