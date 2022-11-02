import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:5001/api/User",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config: any) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (err.response) {
      // Validation failed, ...
      if (err.response.status === 400 && err.response.data) {
        return Promise.reject(err.response.data);
      }
      // Access Token was expired
      if (
        err.response.status === 401 &&
        !originalConfig._retry &&
        getAccessToken() != null
      ) {
        originalConfig._retry = true;
        try {
          const rs = await refreshAccessToken();
          const { accessToken, refreshToken } = rs.data;
          setRefreshToken(refreshToken);
          setAccessToken(accessToken);
          instance.defaults.headers.common["Authorization"] =
            "Bearer " + accessToken;
          return instance(originalConfig);
        } catch (_error: any) {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data);
          }
          return Promise.reject(_error);
        }
      }
      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data);
      }
      if (err.response.status === 404) {
        if (axios.isAxiosError(err)) {
          return Promise.reject(err.response.data);
        }
        return;
      }
    }
    return Promise.reject(err);
  }
);

function refreshAccessToken() {
  console.log("refreshAccessToken");
  return instance.post("/RefreshToken", {
    token: getAccessToken(),
    refreshToken: getrefreshToken(),
  });
}

const responseBody: any = (response: any) => response.data;

const requests = {
  get: (url: string) => instance.get(url).then().then(responseBody),
  post: (url: string, body?: any) =>
    instance.post(url, body).then().then(responseBody),
  put: (url: string, body?: string) =>
    instance.put(url, body).then().then(responseBody),
  patch: (url: string, body: string) =>
    instance.patch(url, body).then().then(responseBody),
  del: (url: string) => instance.delete(url).then().then(responseBody),
};

const User = {
  login: (user: any) => requests.post(`/login`, user),
  register: (user: any) => requests.post(`/register`, user),
  forgotPassword: (email: string) => requests.post(`/ForgotPassword`, email),
  getAllUsers: (start: number, end: number, isAll: boolean = false) =>
    requests.get(
      "/getAllUsers?start=" + start + "&end=" + end + "&isAll=" + isAll
    ),
  logout: (userId: string) => requests.get("/logout?userId=" + userId),
  changePassword: (user: any) => requests.post(`/ChangePassword`, user),
  updateProfile: (user: any) => requests.post(`/UpdateProfile`, user),
};

export async function updateProfile(user: any) {
  const data = await User.updateProfile(user)
    .then((response) => {
      return {
        response,
      };
    })
    .catch((error) => {
      return error.response;
    });
  return data;
}

export async function changePassword(user: any) {
  const data = await User.changePassword(user)
    .then((response) => {
      return {
        response,
      };
    })
    .catch((error) => {
      return error.response;
    });
  return data;
}

export async function login(user: any) {
  const data = await User.login(user)
    .then((response) => {
      return {
        response,
      };
    })
    .catch((error) => {
      return error.response;
    });
  return data;
}

export async function logout(userId: string) {
  const data = await User.logout(userId)
    .then((response) => {
      return {
        response,
      };
    })
    .catch((error) => {
      return error.response;
    });
  return data;
}

export async function register(user: any) {
  const data = await User.register(user)
    .then((response) => {
      return {
        response,
      };
    })
    .catch((error) => {
      return error.response;
    });
  return data;
}

export async function forgotPassword(email: string) {
  const data = await User.forgotPassword(email)
    .then((response) => {
      return {
        response,
      };
    })
    .catch((error) => {
      return error.response;
    });
  return data;
}

export async function getAllUsers(
  start: number,
  end: number,
  isAll: boolean = false
) {
  const data = await User.getAllUsers(start, end, isAll)
    .then((response) => {
      return {
        response,
      };
    })
    .catch((error) => {
      return error;
    });
  return data;
}
export function setAccessToken(token: string) {
  window.localStorage.setItem("accessToken", token);
}

export function setRefreshToken(token: string) {
  window.localStorage.setItem("refreshToken", token);
}

export function getAccessToken(): null | string {
  const accessToken = window.localStorage.getItem("accessToken");
  return accessToken;
}

export function getrefreshToken(): null | string {
  const refreshToken = window.localStorage.getItem("refreshToken");
  return refreshToken;
}

export function removeTokens() {
  window.localStorage.removeItem("accessToken");
  window.localStorage.removeItem("refreshToken");
}
