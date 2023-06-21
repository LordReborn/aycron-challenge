import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import useScript from "../hooks/useScript";

const Layout = () => {
  const { isLoggedIn, isManager, handleUser } = useContext(AuthContext);

  const src = `https://maps.googleapis.com/maps/api/js?key=${
    import.meta.env.VITE_GOOGLE_API_KEY
  }`;

  useScript(isLoggedIn && src);

  const pages = [{ label: "Home", to: "/" }];

  if (isManager) pages.push({ label: "Calculate", to: "/calculate" });

  const logout = () => {
    handleUser(null);
    navigate("/");
  };

  const navigate = useNavigate();
  return (
    <>
      {isLoggedIn && (
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: "flex" }}>
                {pages.map((page) => (
                  <Button
                    key={page.label}
                    onClick={() => navigate(page.to)}
                    color="inherit"
                  >
                    {page.label}
                  </Button>
                ))}
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button key="logout" color="inherit" onClick={logout}>
                  Logout
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}
      <Container maxWidth="md">
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
