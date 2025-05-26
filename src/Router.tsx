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
import { DriverAvailableRides } from "./Pages/DriverAvailableRides";
import { DriverAcceptedRides } from "./Pages/DriverAcceptedRides";
import { DriverLogin } from "./Pages/DriverLogin";
import { DriverAvailability } from "./Components/DriverAvailability";
import { DriverDeclinedRides } from "./Pages/DriverDeclinedRides";
import { DriverCurrentRide } from "./Pages/DriverCurrentRide";
import { SendingRequestToDriver } from "./Components/SendingRequestToDriver";
import { UserCurrentRide } from "./Pages/UserCurrentRide";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<SelectRole />} />
      <Route path="driver" element={<DriverLayout />}>
        <Route index element={<DriverAvailability />} />
        <Route path="login" element={<DriverLogin />} />
        <Route index element={<DriverFeatures />} />
        <Route path="available-rides" element={<DriverAvailableRides />} />
        <Route path="accepted-rides" element={<DriverAcceptedRides />} />
        <Route path="declined-rides" element={<DriverDeclinedRides />} />
        <Route path="current-ride" element={<DriverCurrentRide />} />
      </Route>

      <Route path="user" element={<UserLayout />}>
        <Route index element={<App />} />
        <Route path="login" element={<UserLogin />} />
        <Route path="request-ride/:UserConnectionId" element={<SendingRequestToDriver />} />
        <Route path="ride" element={<UserCurrentRide />} />
      </Route>
      <Route
        path="book-ride/:pickupLat/:pickupLon/:dropLat/:dropLon"
        element={<BookRide />}
      />
    </>
  )
);
