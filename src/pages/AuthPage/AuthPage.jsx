import {
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import useAuthPage from "./hooks/useAuthPage";
import { roles } from "../../utils/constants";

const AuthPage = () => {
  const {
    data,
    error,
    showPassword,
    isRegister,
    handleChange,
    handleClickShowPassword,
    handleSubmit,
    handleSwitch,
  } = useAuthPage();

  return (
    <Grid
      onSubmit={handleSubmit}
      component="form"
      container
      spacing={3}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item xs={12}>
        <TextField
          required
          value={data.username}
          onChange={handleChange}
          name="username"
          label="Username"
          size="small"
          sx={{ minWidth: "300px" }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          value={data.password}
          onChange={handleChange}
          name="password"
          label="Password"
          size="small"
          type={showPassword ? "text" : "password"}
          sx={{ minWidth: "300px" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      {isRegister && (
        <Grid item xs={12}>
          <TextField
            required
            select
            value={data.role}
            onChange={handleChange}
            name="role"
            label="Role"
            size="small"
            sx={{ minWidth: "150px" }}
          >
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      )}
      {!!error && (
        <Grid item>
          <FormHelperText error>{error}</FormHelperText>
        </Grid>
      )}
      <Grid
        item
        container
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <Button size="small" variant="text" onClick={handleSwitch}>
            {isRegister ? "I already have an account" : "Sign up"}
          </Button>
        </Grid>
        <Grid item>
          <Button type="submit" variant="outlined">
            {isRegister ? "Sign up" : "Sign in"}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AuthPage;
