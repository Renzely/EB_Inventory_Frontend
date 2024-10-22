import Topbar from "./components/topbar/Topbar";
import Sidebar from "./components/sidebar/Sidebar";
import "./App.css";
import "./defaultApp.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
} from "react-router-dom";

import ViewAttendance from "./components/pages/attendance/ViewAttendance";
import Attendance from "./components/pages/attendance/Attendance";
import Account from "./components/pages/account/Account";
import ViewParcel from "./components/pages/inventory/ViewParcel";
import Branch from "./components/pages/Branches/Branch";
import RTV from "./components/pages/ReturnToVendor/RTV";
import Login from "./components/Admin/login";
import Admin from "./components/pages/AdminAccount/Admin";
import ForgotPassword from "./components/Admin/forgotpassword";
import Path from "./path/Path";
import Inventory from "./components/pages/inventory/inventoryData";
import OutletInputs from "./components/pages/OutletInputs/outletinputs";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<Path />}>
          <Route path="/" element={<Login />} />
          <Route path="/view-outlet" element={<Branch />} />
          <Route path="/view-outletinputs" element={<OutletInputs />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/view-admin-accounts" element={<Admin />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/view-attendance" element={<ViewAttendance />} />
          <Route path="/view-accounts" element={<Account />} />
          <Route path="/view-RTV" element={<RTV />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
