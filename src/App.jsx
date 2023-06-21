import { useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import AuthPage from "./pages/AuthPage/AuthPage";
import CalculatePage from "./pages/CalculatePage";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";

function App() {
  const { isLoggedIn, isManager } = useContext(AuthContext);
  const canAccessCalculate = isLoggedIn && isManager;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: isLoggedIn ? <HomePage /> : <AuthPage /> },
        canAccessCalculate && {
          path: "calculate",
          element: <CalculatePage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
