import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import BrowseInfluencersPage from './pages/BrowseInfluencersPage.jsx';
import InfluencerDetailPage from './pages/InfluencerDetailPage.jsx';
import OpportunitiesPage from './pages/OpportunitiesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import BrandDashboardPage from './pages/BrandDashboardPage.jsx';
import InfluencerDashboardPage from './pages/InfluencerDashboardPage.jsx';
import ChatBotPage from './pages/ChatBotPage.jsx';
import ReelsPage from './pages/ReelsPage.jsx';
import MessagesPage from './pages/MessagesPage.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="browse" element={<BrowseInfluencersPage />} />
        <Route path="influencers/:id" element={<InfluencerDetailPage />} />
        <Route path="opportunities" element={<OpportunitiesPage />} />
        <Route path="reels" element={<ReelsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route
          path="messages"
          element={
            <RequireAuth>
              <MessagesPage />
            </RequireAuth>
          }
        />
        <Route
          path="ai-matcher"
          element={
            <RequireAuth role="brand">
              <ChatBotPage />
            </RequireAuth>
          }
        />
        <Route
          path="dashboard/brand"
          element={
            <RequireAuth role="brand">
              <BrandDashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="dashboard/influencer"
          element={
            <RequireAuth role="influencer">
              <InfluencerDashboardPage />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
