import _ from "lodash"
import { Cookies } from "react-cookie";

const LOGIN_KEY = "is_login"
const LOGIN_DURATION = 1000 * 60 * 30

const cookies = new Cookies()

export function login() {
    cookies.set(LOGIN_KEY, true, {
        path: "/",
        expires: new Date(Date.now() + LOGIN_DURATION)
    })
}

export function logout() {
    cookies.remove(LOGIN_KEY)
}

export function isLogin(): boolean {
    const value = cookies.get(LOGIN_KEY)
    return Boolean(value) 
}