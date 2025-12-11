import Home from "../pages/Home/Home";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import PlantDetails from "../pages/PlantDetails/PlantDetails";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import AddContest from "../pages/Dashboard/Creator/AddContest";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import Profile from "../pages/Dashboard/Common/Profile";
import Statistics from "../pages/Dashboard/Common/Statistics";
import MainLayout from "../layouts/MainLayout";
import MyCreatedContests from "../pages/Dashboard/Creator/MyCreatedContests";
import ManageContests from "../pages/Dashboard/Creator/ManageContests";
import MyParticipateContest from "../pages/Dashboard/user/MyParticipateContest";
import { createBrowserRouter } from "react-router";
import AllContests from "../pages/AllContests/AllContests";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import Submissions from "../pages/Dashboard/Creator/Submissions";
import SubmissionDetails from "../pages/Dashboard/Creator/SubmissionDetails";
import MyWinningContest from "../pages/Dashboard/user/MyWinningContest";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/all-contests",
        element: <AllContests />,
      },
      {
        path: "/plant/:id",
        element: <PlantDetails />,
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Statistics />
          </PrivateRoute>
        ),
      },
      {
        path: "add-contests",
        element: (
          <PrivateRoute>
            <AddContest />
          </PrivateRoute>
        ),
      },
      {
        path: "my-created-contests",
        element: (
          <PrivateRoute>
            <MyCreatedContests />
          </PrivateRoute>
        ),
      },
      {
        path: "submissions/:id",
        element: (
          <PrivateRoute>
            <Submissions />
          </PrivateRoute>
        ),
      },
      {
        path: "single-submissions/:id",
        element: (
          <PrivateRoute>
            <SubmissionDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <PrivateRoute>
            <ManageUsers />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "my-participate",
        element: (
          <PrivateRoute>
            <MyParticipateContest />
          </PrivateRoute>
        ),
      },
      {
        path: "my-winning-contest",
        element: (
          <PrivateRoute>
            <MyWinningContest />
          </PrivateRoute>
        ),
      },
      {
        path: "manage-contests",
        element: <ManageContests />,
      },
    ],
  },
]);
