import Dashbord from "./pages/dashbord";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import UserAccount from "./pages/Account";
import Documents from "./pages/Documents";
import Templates from "./pages/Templates";
import Signature from "./pages/Signature";
import Billing from "./pages/Billing";
import Users from "./pages/Users";
import CreateTeams from "./pages/CreateTeam";
import LoginPage from "./pages/LoginPage";
import RegisterUser from "./pages/RegisterUser";
import DocumentSignPage from "./pages/DocumentSignPage";
import SingleDocumentStatus from "./pages/SingleDocumentStatus";
import DownloadDocumentLogFiles from "./pages/DownloadDocument";
import TeamDashbord from "./pages/Team-dashbord";
import AcceptInvitationComponent from "./pages/AcceptInvitationComponent";
import TeamDocumentStatus from "./pages/TeamDocumentStatus";
import TeamDocumentDownloadLogFiles from "./pages/TeamDocumentDownload";
import TeamDocumentSignPage from "./pages/TeamDocumentSignPage";

// import EmailForm from "./components/SignDocument";
// import FileListForm from "./pages/file-list-try";

import { AuthProvider } from "./contexts/AuthContext";
import { DocumentListProvider } from "./contexts/DocumentsContext";
import { TeamListProvider } from "./contexts/TeamContext";
import { TeamDocumentListProvider } from "./contexts/TeamDocumentsContext";
// import PrivateRoutes from "./utils/PrivateRout";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

import Footer from "./components/Footer";
import PrivateRoutes from "./utils/PrivateRout";

import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function App() {
  return (
    <div>
      <Router>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Header />
            <Routes>
              <Route>
                <Route path="/" element={<HomePage />} />
              </Route>
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashbord" element={<Dashbord />} />
                <Route path="/account" element={<UserAccount />} />
                <Route
                  path="/documents"
                  element={
                    <DocumentListProvider>
                      <Documents />
                    </DocumentListProvider>
                  }
                />
                <Route path="/templates" element={<Templates />} />
                <Route path="/signature" element={<Signature />} />
                <Route path="/billing" element={<Billing />} />
                <Route
                  path="/team/users/:id"
                  element={
                    <TeamListProvider>
                      <Users />
                    </TeamListProvider>
                  }
                />
                <Route path="/create-teams" element={<CreateTeams />} />
                <Route
                  path="/team-dashbord/:id"
                  element={
                    <TeamDocumentListProvider>
                      <TeamListProvider>
                        <TeamDashbord />
                      </TeamListProvider>
                    </TeamDocumentListProvider>
                  }
                />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterUser />} />
              {/* <Route
                path="/sign-documents/:id"
                element={<DocumentSignPage />}
              /> */}
              <Route
                path="team/sign-documents/:sign_id"
                element={<TeamDocumentSignPage />}
              />
              <Route
                path="/document-status/:id"
                element={
                  <DocumentListProvider>
                    <SingleDocumentStatus />
                  </DocumentListProvider>
                }
              />
              <Route
                path="/team/document-status/:id/:sign_id"
                element={
                  <TeamDocumentListProvider>
                    <TeamDocumentStatus />
                  </TeamDocumentListProvider>
                }
              />
              <Route
                path="/team/download-document-log-file/:id/:sign_id"
                element={
                  <TeamDocumentListProvider>
                    <TeamDocumentDownloadLogFiles />
                  </TeamDocumentListProvider>
                }
              />
              <Route
                path="/download-document-log-file/:id"
                element={
                  <DocumentListProvider>
                    <DownloadDocumentLogFiles />
                  </DocumentListProvider>
                }
              />
            </Routes>
            <Routes>
              <Route
                path="/accept-invitation/"
                element={<AcceptInvitationComponent />}
              />
            </Routes>
            <Routes>
              <Route
                path="/sign-documents/:id"
                element={<DocumentSignPage />}
              />
            </Routes>
            <Footer />
          </AuthProvider>
        </QueryClientProvider>
      </Router>
    </div>
  );
}

export default App;
