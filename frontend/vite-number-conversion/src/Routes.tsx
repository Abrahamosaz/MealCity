import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import LandingPage from "./pages/Home/LandingPage/LandingPage";
import NoMatch from "./pages/NoMatch/NoMatch";

function Router() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Home />}>
        <Route path="*" element={<NoMatch />} />
        <Route index element={<LandingPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default Router;
