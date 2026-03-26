/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SermonProvider } from './context/SermonContext';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { EditorPage } from './pages/EditorPage';
import { TeleprompterPage } from './pages/TeleprompterPage';
import { ArchivePage } from './pages/ArchivePage';

export default function App() {
  return (
    <SermonProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-indigo-100">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/write" element={<EditorPage />} />
            <Route path="/mimbar" element={<TeleprompterPage />} />
            <Route path="/archive" element={<ArchivePage />} />
          </Routes>
          <BottomNav />
        </div>
      </Router>
    </SermonProvider>
  );
}
