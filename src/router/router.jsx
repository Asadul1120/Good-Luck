// router.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NormalSlip from "../pages/NormalSlip";
import NightSlip from "../pages/NightSlip";
import DepositRequest from "../pages/DepositRequest";
import SpecialSlip from "../pages/SpecialSlip";
import Profile from "./../pages/Profile";
import ChangePassword from "./../pages/ChangePassword";
import DepositHistory from "../pages/DepositHistory";
import SlipPayment from "../pages/SlipPayment";
import Transaction from "../pages/Transaction";
import MedicalCenter from "../pages/MedicalCenter";
import UsersRegister from "../pages/AdminPages/UsersRegister";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./../pages/Dashboard";
import AdminRoute from "./AdminRoute";
import AdminPanel from "../pages/AdminPages/AdminPanel";
import AdminDashboard from "../pages/AdminPages/AdminDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/depositHistory",
        element: (
          <PrivateRoute>
            <DepositHistory />
          </PrivateRoute>
        ),
      },
      ,
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/normal-slip",
        element: (
          <PrivateRoute>
            <NormalSlip />
          </PrivateRoute>
        ),
      },

      {
        path: "/night-slip",
        element: (
          <PrivateRoute>
            <NightSlip />
          </PrivateRoute>
        ),
      },
      {
        path: "/special-slip",
        element: (
          <PrivateRoute>
            <SpecialSlip />
          </PrivateRoute>
        ),
      },
      {
        path: "/transaction",
        element: (
          <PrivateRoute>
            <Transaction />
          </PrivateRoute>
        ),
      },
      {
        path: "/medicalCenter",
        element: (
          <PrivateRoute>
            <MedicalCenter />
          </PrivateRoute>
        ),
      },
      {
        path: "/slip-payment",
        element: <SlipPayment />,
      },
      {
        path: "/change-password",
        element: (
          <PrivateRoute>
            <ChangePassword />
          </PrivateRoute>
        ),
      },
      {
        path: "/depositRequest",
        element: (
          <PrivateRoute>
            <DepositRequest />
          </PrivateRoute>
        ),
      },
      {
        path: "/addUser",
        element: (
          <AdminRoute>
            <UsersRegister />
          </AdminRoute>
        ),
      },
      {
        path: "/adminPanel",
        element: (
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        ),
      },
      {
        path: "/adminDashboard",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
