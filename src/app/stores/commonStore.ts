import {makeAutoObservable, reaction} from "mobx";
import {ServerError} from "../models/common/ServerError.ts";

const SESSION_DATE_KEY = 'jwt_session_date';

const getTodaySessionDate = () => new Date().toISOString().slice(0, 10);

const getInitialToken = () => {
  const token = localStorage.getItem('jwt');
  const sessionDate = localStorage.getItem(SESSION_DATE_KEY);

  if (token && sessionDate === getTodaySessionDate()) {
    return token;
  }

  localStorage.removeItem('jwt');
  localStorage.removeItem(SESSION_DATE_KEY);
  return null;
};

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = getInitialToken();
  appLoaded = false;
  onlineUsers: string[] = [];

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.token,
      token => {
        if (token) {
          localStorage.setItem('jwt', token);
          localStorage.setItem(SESSION_DATE_KEY, getTodaySessionDate());
        } else {
          localStorage.removeItem('jwt');
          localStorage.removeItem(SESSION_DATE_KEY);
        }
      }
    )
  }

  shouldForceLogout = () => {
    if (!this.token) return false;

    const storedToken = localStorage.getItem('jwt');
    const sessionDate = localStorage.getItem(SESSION_DATE_KEY);

    const isTokenMismatch = storedToken !== this.token;
    const isSessionExpired = sessionDate !== getTodaySessionDate();

    if (isTokenMismatch || isSessionExpired) {
      this.setToken(null);
      return true;
    }

    return false;
  }

  setOnlineUsers = (usernames: string[]) => {
    this.onlineUsers = usernames;
  }

  addOnlineUsers = (username: string) => {
    this.onlineUsers.push(username);
  }

  removeOnlineUsers = (username: string) => {
    this.onlineUsers = this.onlineUsers.filter(x => x !== username);
  }

  setServerError(error: ServerError) {
    this.error = error;
  }

  setToken = (token: string | null) => {
    this.token = token;
  }

  setAppLoaded = () => {
    this.appLoaded = true;
  }
}