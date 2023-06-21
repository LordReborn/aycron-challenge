const AuthService = (() => {
  const register = ({ username, password, role }) => {
    const user = { username, password, role };
    const usersStorage = window.localStorage.getItem("users");
    if (!usersStorage) {
      window.localStorage.setItem("users", JSON.stringify([user]));
      return Promise.resolve(user);
    }
    const users = JSON.parse(usersStorage);
    if (users.some((_user) => _user.username === user.username)) {
      return Promise.reject({ message: "User already exist" });
    }
    const newUsers = [...users, user];
    window.localStorage.setItem("users", JSON.stringify(newUsers));
    return Promise.resolve(user);
  };

  const login = ({ username, password }) => {
    const credentials = { username, password };
    const usersStorage = window.localStorage.getItem("users");
    if (!usersStorage) return Promise.reject({ message: "User doesn't exist" });
    const users = JSON.parse(usersStorage);
    const user = users.find(
      (_user) =>
        _user.username === credentials.username &&
        _user.password === credentials.password
    );
    if (!user) return Promise.reject({ message: "User doesn't exist" });
    return Promise.resolve(user);
  };

  return { register, login };
})();

export default AuthService;
