import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ReadinessProvider } from './contexts/ReadinessContext';
import { DisasterPredictionProvider } from './contexts/DisasterPredictionContext';
import { EmergencyKitProvider } from './contexts/EmergencyKitContext'; // 1. Import the provider
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import FloodRiskMap from './pages/map';
import Readiness from './pages/Readiness';
import Progress from './pages/Progress';
import EmergencyKit from './pages/EmergencyKit';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ProfileSetup from './pages/ProfileSetup';
import ForgotPassword from './pages/ForgotPassword';
import CommunityOverview from './components/dashboard/CommunityOverview';
import SchoolManagement from './components/dashboard/SchoolManagement';
import DisasterCoordinatorDashboard from './pages/DisasterCoordinatorDashboard';
import Settings from './pages/Settings';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Recommendations from './pages/Recommendations';
import AllAlerts from './pages/AllAlerts';
import AffectedPopulation from './pages/AffectedPopulation';
import ResponseTeams from './pages/ResponseTeams';

function App() {
  return (
    <AuthProvider>
      <ReadinessProvider>
        <DisasterPredictionProvider>
          {/* 2. Wrap the application with the EmergencyKitProvider */}
          <EmergencyKitProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Routes */}
                <Route path="/profile-setup" element={
                  <ProtectedRoute>
                    <ProfileSetup />
                  </ProtectedRoute>
                } />

                <Route path="/*" element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/assessment" element={<Assessment />} />
                        <Route path="/readiness" element={<Readiness />} />
                        <Route path="/progress" element={<Progress />} />
                        <Route path="/floodriskmap" element={<FloodRiskMap />} />
                        <Route path="/emergency-kit" element={<EmergencyKit />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/community-dashboard" element={
                          <ProtectedRoute allowedRoles={['community_leader']}>
                            <CommunityOverview />
                          </ProtectedRoute>
                        } />
                        <Route path="/school-dashboard" element={
                          <ProtectedRoute allowedRoles={['school_admin']}>
                            <SchoolManagement />
                          </ProtectedRoute>
                        } />
                        <Route path="/coordinator-dashboard" element={
                          <ProtectedRoute allowedRoles={['disaster_coordinator']}>
                            <DisasterCoordinatorDashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/recommendations" element={<Recommendations />} />
                        <Route path="/all-alerts" element={
                          <ProtectedRoute allowedRoles={['disaster_coordinator']}>
                            <AllAlerts />
                          </ProtectedRoute>
                        } />
                        <Route path="/affected-population" element={
                          <ProtectedRoute allowedRoles={['disaster_coordinator']}>
                            <AffectedPopulation />
                          </ProtectedRoute>
                        } />
                        <Route path="/response-teams" element={
                          <ProtectedRoute allowedRoles={['disaster_coordinator']}>
                            <ResponseTeams />
                          </ProtectedRoute>
                        } />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                } />
              </Routes>
            </Router>
          </EmergencyKitProvider>
        </DisasterPredictionProvider>
      </ReadinessProvider>
    </AuthProvider>
  );
}

export default App;
