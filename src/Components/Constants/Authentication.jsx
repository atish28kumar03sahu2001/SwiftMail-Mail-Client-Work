// src/Components/Constants/Authentication.jsx
import { AuthStore } from "../Store/AuthStore";
import Cookies from "js-cookie";
export const Authentication = () => {
    const {AuthToken, UserId} = AuthStore.getState();

    const expiresInDays = 10 * 365;

    Cookies.set("AuthToken",AuthToken,{ expires: expiresInDays, path: "/", secure: true, sameSite: "strict" });
    Cookies.set("UserId",UserId,{ expires: expiresInDays, path: "/", secure: true, sameSite: "strict" });
}