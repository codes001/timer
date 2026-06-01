// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { Controller } from './pages/Controller';
// import { Viewer } from './pages/Viewer';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* The Production Dashboard */}
//         <Route path="/controller/:roomId" element={<Controller />} />
        
//         {/* The Fullscreen Stage Output */}
//         <Route path="/viewer/:roomId" element={<Viewer />} />
        
//         {/* Default to a sample room */}
//         <Route path="/" element={<Navigate to="/controller/room-1" />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { Controller } from './pages/Controller';
// import { Viewer } from './pages/Viewer';

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/controller" element={<Controller />} />
//         <Route path="/viewer" element={<Viewer />} />
//         <Route path="*" element={<Navigate to="/controller" />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { Controller } from './pages/Controller';
// import { Viewer } from './pages/Viewer';

// export default function App() {
//   // We generate a random room ID for users who land on the base URL
//   const defaultRoomId = Math.random().toString(36).substring(2, 7);

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Dynamic routes that capture the roomId from the URL */}
//         <Route path="/controller/:roomId" element={<Controller />} />
//         <Route path="/viewer/:roomId" element={<Viewer />} />
        
//         {/* If user goes to /controller, redirect them to a specific room */}
//         <Route path="/controller" element={<Navigate to={`/controller/${defaultRoomId}`} replace />} />
        
//         {/* Default redirect for anything else */}
//         <Route path="*" element={<Navigate to={`/controller/${defaultRoomId}`} replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Controller } from './pages/Controller';
import { Viewer } from './pages/Viewer';
import { useTimerStore } from './store/userRoomStore'; // Ensure path is correct

export default function App() {
  // 1. Get the load function from your store
  const loadFromStorage = useTimerStore((state) => state.loadFromStorage);

  // 2. Run this ONCE when the app first starts or refreshes
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Generate a random room ID for users who land on the base URL
  const defaultRoomId = Math.random().toString(36).substring(2, 7);

  return (
    <BrowserRouter>
      <Routes>
        {/* Dynamic routes that capture the roomId from the URL */}
        <Route path="/controller/:roomId" element={<Controller />} />
        <Route path="/viewer/:roomId" element={<Viewer />} />
        
        {/* If user goes to /controller, redirect them to a specific room */}
        <Route path="/controller" element={<Navigate to={`/controller/${defaultRoomId}`} replace />} />
        
        {/* Default redirect for anything else */}
        <Route path="*" element={<Navigate to={`/controller/${defaultRoomId}`} replace />} />
      </Routes>
    </BrowserRouter>
  );
}



