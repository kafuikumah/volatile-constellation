import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import Home from "./pages/Home";
import Story from "./pages/Story";
import Details from "./pages/Details";
import BridalParty from "./pages/BridalParty";
import Gallery from "./pages/Gallery";
import RSVP from "./pages/RSVP";
import GuestExperience from "./pages/GuestExperience";
import Invitation from "./pages/Invitation";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "story", Component: Story },
      { path: "details", Component: Details },
      { path: "bridal-party", Component: BridalParty },
      { path: "gallery", Component: Gallery },
      { path: "rsvp", Component: RSVP },
      { path: "guest-experience", Component: GuestExperience },
      { path: "invitation", Component: Invitation },
      { path: "*", Component: NotFound },
    ],
  },
]);
