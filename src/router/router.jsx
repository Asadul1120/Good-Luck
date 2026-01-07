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
import Profile from './../pages/Profile';
import ChangePassword from './../pages/ChangePassword';

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
        path: "/login",
        element: <Login />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/normal-slip",
        element: <NormalSlip />,
      },
      {
        path: "/night-slip",
        element: <NightSlip />,
      },
      {
        path: "/special-slip",
        element: <SpecialSlip  />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/depositRequest",
        element: <DepositRequest />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
