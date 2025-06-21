import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import UserLayout from "./Components/UserLayout";
import App from "./App";
import BookRide from "./Pages/BookRide";
import { SelectRole } from "./Pages/SelectRole";
import DriverLayout from "./Components/DriverLayout";
import { DriverFeatures } from "./Components/DriverFeatures";
import { UserLogin } from "./Pages/UserLogin";
import { DriverAcceptedRides } from "./Pages/DriverAcceptedRides";
import { DriverLogin } from "./Pages/DriverLogin";
import { DriverAvailability } from "./Components/DriverAvailability";
import { UserRegistration } from "./Pages/UserRegistration";
import { DriverRegistration } from "./Components/DriverRegistration";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<SelectRole />} />
      <Route path="driver" element={<DriverLayout />}>
        <Route index element={<DriverAvailability />} />
        <Route path="login" element={<DriverLogin />} />
        <Route path="register" element={<DriverRegistration />} />
        <Route index element={<DriverFeatures />} />
        <Route path="accepted-rides" element={<DriverAcceptedRides />} />
      </Route>

      <Route path="user" element={<UserLayout />}>
        <Route index element={<App />} />
        <Route path="login" element={<UserLogin />} />
        <Route path="register" element={<UserRegistration />} />
        <Route
          path="book-ride/:pickupLat/:pickupLon/:dropLat/:dropLon"
          element={<BookRide />}
        />
      </Route>
    </>
  )
);

// 26.9166996
// 75.6962098