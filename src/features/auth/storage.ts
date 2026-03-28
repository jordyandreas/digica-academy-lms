export const AUTH_LOGIN_KEY = "isLogin";
export const AUTH_EMAIL_KEY = "userEmail";

export type AuthSession = {
  isLogin: boolean;
  email: string | null;
};

export function readAuthSession(): AuthSession {
  if (typeof window === "undefined") {
    return { isLogin: false, email: null };
  }
  const isLogin = localStorage.getItem(AUTH_LOGIN_KEY) === "true";
  const email = localStorage.getItem(AUTH_EMAIL_KEY);
  return { isLogin, email: email || null };
}

export function writeAuthSession(isLogin: boolean, email?: string | null) {
  if (typeof window === "undefined") return;
  if (isLogin) {
    localStorage.setItem(AUTH_LOGIN_KEY, "true");
    if (email) localStorage.setItem(AUTH_EMAIL_KEY, email);
    else localStorage.removeItem(AUTH_EMAIL_KEY);
  } else {
    localStorage.removeItem(AUTH_LOGIN_KEY);
    localStorage.removeItem(AUTH_EMAIL_KEY);
  }
  window.dispatchEvent(new Event("digica-auth-change"));
}
