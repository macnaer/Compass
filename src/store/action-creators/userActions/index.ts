import { UserActionTypes, UserActions } from "../../reducers/userReducer/types";
import { Dispatch } from "redux";
import { toast } from "react-toastify";
import {
  login,
  forgotPassword,
  removeTokens,
  getAllUsers,
  register,
  setAccessToken,
  setRefreshToken,
  logout,
  changePassword,
  updateProfile,
  setSelectedUser,
  removeSelectedUser,
  updateUser,
} from "../../../services/api-user-service";
import jwtDecode from "jwt-decode";
import { CurrentPaginations } from "../../../pages/users/allUsers";

export const LoginUser = (user: any) => {
  return async (dispatch: Dispatch<UserActions>) => {
    try {
      dispatch({ type: UserActionTypes.START_REQUEST });
      const data = await login(user);
      const { response } = data;
      if (!response.isSuccess) {
        dispatch({
          type: UserActionTypes.LOGIN_USER_ERROR,
          payload: data.response.message,
        });
        toast.error(response.message);
      } else {
        const { accessToken, refreshToken, message } = data.response;

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        AuthUser(accessToken, message, dispatch);
      }
    } catch (e) {
      dispatch({
        type: UserActionTypes.SERVER_USER_ERROR,
        payload: "Unknown error",
      });
    }
  };
};

export const RegisterUser = (user: any) => {
  return async (dispatch: Dispatch<UserActions>) => {
    try {
      dispatch({ type: UserActionTypes.START_REQUEST });
      const data = await register(user);
      const { response } = data;
      if (!response.isSuccess) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        dispatch({
          type: UserActionTypes.REGISTER_USER_SUCCESS,
          payload: response.message,
        });
      }
    } catch (e) {
      dispatch({
        type: UserActionTypes.SERVER_USER_ERROR,
        payload: "Unknown error",
      });
    }
  };
};

export const ForgotPassword = (email: string) => {
  return async (dispatch: Dispatch<UserActions>) => {
    try {
      dispatch({ type: UserActionTypes.START_REQUEST });
      const data = await forgotPassword(email);
      const { response } = data;
      if (!response.isSuccess) {
        dispatch({
          type: UserActionTypes.FORGOT_USER_PASSWORD_ERROR,
          payload: data.response,
        });
        toast.error(response.message);
      } else {
        dispatch({
          type: UserActionTypes.FORGOT_USER_PASSWORD_SUCCESS,
          payload: data.response,
        });
      }
    } catch (e) {
      dispatch({
        type: UserActionTypes.SERVER_USER_ERROR,
        payload: "Unknown error",
      });
    }
  };
};

export const LogOut = (id: string) => {
  return async (dispatch: Dispatch<UserActions>) => {
    const data = await logout(id);
    const { response } = data;
    if (response.isSuccess) {
      removeTokens();
      removeSelectedUser();
      dispatch({
        type: UserActionTypes.LOGOUT_USER,
      });
    }
  };
};

export const GetAllUsers = (paginations: CurrentPaginations) => {
  return async (dispatch: Dispatch<UserActions>) => {
    try {
      dispatch({ type: UserActionTypes.START_REQUEST });
      const { response } = await getAllUsers(
        paginations.start,
        paginations.end,
        paginations.isAll
      );

      dispatch({
        type: UserActionTypes.ALL_USERS_LOADED,
        payload: { message: response.message, allUsers: response.payload },
      });
    } catch (error) {
      dispatch({
        type: UserActionTypes.SERVER_USER_ERROR,
        payload: "Unknown error",
      });
    }
  };
};

export const ChangePassword = (user: any) => {
  return async (dispatch: Dispatch<UserActions>) => {
    try {
      dispatch({ type: UserActionTypes.START_REQUEST });
      const data = await changePassword(user);
      const { response } = data;
      if (!response.isSuccess) {
        dispatch({
          type: UserActionTypes.LOGIN_USER_ERROR,
          payload: response.message,
        });
        toast.error(response.message);
      } else {
        dispatch({
          type: UserActionTypes.FINISHED_REQUEST,
          payload: response.message,
        });
        toast.success(response.message);
      }
    } catch (e) {
      dispatch({
        type: UserActionTypes.SERVER_USER_ERROR,
        payload: "Unknown error",
      });
    }
  };
};

export const SelectdUser = (user: any) => {
  return async (dispatch: Dispatch<UserActions>) => {
    dispatch({ type: UserActionTypes.SELECTED_USER, payload: user });
    setSelectedUser(user);
  };
};

export const UpdateProfile = (user: any) => {
  return async (dispatch: Dispatch<UserActions>) => {
    try {
      dispatch({ type: UserActionTypes.START_REQUEST });
      const data = await updateProfile(user);
      const { response } = data;
      if (!response.isSuccess) {
        dispatch({
          type: UserActionTypes.FINISHED_REQUEST,
          payload: response.message,
        });
        toast.error(response.message);
      } else {
        const { accessToken, refreshToken, message } = data.response;
        removeTokens();
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        AuthUser(accessToken, message, dispatch);
        toast.success(response.message);
      }
    } catch (e) {
      dispatch({
        type: UserActionTypes.SERVER_USER_ERROR,
        payload: "Unknown error",
      });
    }
  };
};

export const UpdateUser = (user: any) => {
  return async (dispatch: Dispatch<UserActions>) => {
    try {
      dispatch({ type: UserActionTypes.START_REQUEST });
      const data = await updateUser(user);
      const { response } = data;
      console.log("response ", response);
      // if (!response.isSuccess) {
      //   dispatch({
      //     type: UserActionTypes.FINISHED_REQUEST,
      //     payload: response.message,
      //   });
      //   toast.error(response.message);
      // } else {
      //   const { accessToken, refreshToken, message } = data.response;
      //   removeTokens();
      //   setAccessToken(accessToken);
      //   setRefreshToken(refreshToken);
      //   AuthUser(accessToken, message, dispatch);
      //   toast.success(response.message);
      //}
    } catch (e) {
      dispatch({
        type: UserActionTypes.SERVER_USER_ERROR,
        payload: "Unknown error",
      });
    }
  };
};

export const SelectUser = (
  selectedUser: any,
  dispatch: Dispatch<UserActions>
) => {
  dispatch({ type: UserActionTypes.SELECTED_USER, payload: selectedUser });
};

export const AuthUser = (
  token: string,
  message: string,
  dispatch: Dispatch<UserActions>
) => {
  const decodedToken = jwtDecode(token) as any;
  dispatch({
    type: UserActionTypes.LOGIN_USER_SUCCESS,
    payload: {
      message,
      decodedToken,
    },
  });
};
