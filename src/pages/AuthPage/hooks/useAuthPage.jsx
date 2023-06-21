import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import AuthService from "../../../services/AuthService";

const initialData = { username: "", password: "", role: "operator" };

const useAuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState(initialData);
  const [error, setError] = useState("");
  const { handleUser } = useContext(AuthContext);

  const handleSwitch = () => {
    setError("");
    setData(initialData);
    setIsRegister((prev) => !prev);
  };
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = isRegister
        ? await AuthService.register(data)
        : await AuthService.login(data);
      handleUser(user);
    } catch (e) {
      setError(e?.message);
    }
  };

  return {
    data,
    error,
    isRegister,
    showPassword,
    handleChange,
    handleSwitch,
    handleSubmit,
    handleClickShowPassword,
  };
};

export default useAuthPage;
