import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/dashbord.css";
import "./styles/Header.css";
import "./styles/HomePage.css";
import "./styles/account.css";
import "./styles/documents.css";
import "./styles/accout-form.css";
import "./styles/templates.css";
import "./styles/signature.css";
import "./styles/billing.css";
import "./styles/billing-form.css";
import "./styles/users.css";
import "./styles/team.css";
import "./styles/Register.css";
import "./styles/Login.css";
import "./styles/document-sign.css";
import "./styles/PopUp.css";
import "./styles/signature-pad.css";
import "./styles/single-document-status.css";
import "./styles/download-document-log.css";
import "./styles/footer.css";
import "./styles/user-teams.css";
import "./index.css";

import { registerLicense } from "@syncfusion/ej2-base";

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NAaF5cWWJCf0x0RXxbf1x0ZFRMYlpbQXdPMyBoS35RckViWHxecXZTQ2FVVEFx"
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
