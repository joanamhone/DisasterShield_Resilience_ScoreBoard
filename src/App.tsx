import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ReadinessProvider } from "./contexts/ReadinessContext";
import { DisasterPredictionProvider } from "./contexts/DisasterPredictionContext";
import { EmergencyKitProvider } from "./contexts/EmergencyKitContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Assessment from "./pages/Assessment";
import Readiness from "./pages/Readiness";
import Progress from "./pages/Progress";
import EmergencyKit from "./pages/EmergencyKit";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ProfileSetup from "./pages/ProfileSetup";
import ForgotPassword from "./pages/ForgotPassword";
import CommunityDashboard from "./pages/CommunityDashboard";
import SchoolDashboard from "./pages/SchoolDashboard";
import DisasterCoordinatorDashboard from "./pages/DisasterCoordinatorDashboard";
import Settings from "./pages/Settings";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Recommendations from "./pages/Recommendations";
import Learning from "./pages/Learning";
import ScheduleDrill from "./pages/ScheduleDrill";
import AllAlerts from "./pages/AllAlerts";
import AffectedPopulation from "./pages/AffectedPopulation";
import ResponseTeams from "./pages/ResponseTeams";
import SendAlert from "./pages/SendAlert";
import MapPage from "./pages/map";

function App() {
  return (
    <AuthProvider>
      <ReadinessProvider>
        <DisasterPredictionProvider>
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
                <Route
                  path="/profile-setup"
                  element={
                    <ProtectedRoute>
                      <ProfileSetup />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="assessment" element={<Assessment />} />
                          <Route
                            path="flood-risk-areas"
                            element={<MapPage />}
                          />
                          <Route path="readiness" element={<Readiness />} />
                          <Route path="progress" element={<Progress />} />
                          <Route
                            path="emergency-kit"
                            element={<EmergencyKit />}
                          />
                          <Route path="profile" element={<Profile />} />
                          <Route
                            path="community-dashboard"
                            element={<CommunityDashboard />}
                          />
                          <Route
                            path="school-dashboard"
                            element={<SchoolDashboard />}
                          />
                          <Route
                            path="coordinator-dashboard"
                            element={<DisasterCoordinatorDashboard />}
                          />
                          <Route path="settings" element={<Settings />} />
                          <Route path="terms" element={<Terms />} />
                          <Route path="privacy" element={<Privacy />} />
                          <Route
                            path="recommendations"
                            element={<Recommendations />}
                          />
                          <Route path="learning" element={<Learning />} />
                          <Route
                            path="schedule-drill"
                            element={<ScheduleDrill />}
                          />
                          <Route path="all-alerts" element={<AllAlerts />} />
                          <Route path="send-alert" element={<SendAlert />} />
                          <Route
                            path="affected-population"
                            element={<AffectedPopulation />}
                          />
                          <Route
                            path="response-teams"
                            element={<ResponseTeams />}
                          />

                          <Route path="*" element={<Home />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </EmergencyKitProvider>
        </DisasterPredictionProvider>
      </ReadinessProvider>
    </AuthProvider>
  );
}

export default App;
