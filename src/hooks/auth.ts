import { useEffect, useState } from "react";
import { POST } from "../api/api";
import { generateKeyPair, randomHex, sha256 } from "../utils/crypto";
import { ApiResponseLogin } from "../types/ApiResponseLogin";
import { User } from "../types/User";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [privateKey, setPrivateKey] = useState(
    localStorage.getItem("privateKey") || null
  );
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    validateSession();
  }, [token]);

  async function createGuest(): Promise<boolean> {
    try {
      const username: string = `anonymous_${randomHex(4)}`;
      const password: string = randomHex(16);

      return createAccount(username, password);
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async function createAccount(
    username: string,
    password: string
  ): Promise<boolean> {
    try {
      const res = await POST("auth/register", {
        username: await sha256(username),
        password: await sha256(password),
      });

      if (res.status !== 201) return false;

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async function login(username: string, password: string): Promise<boolean> {
    try {
      const {
        publicKey,
        privateKey,
      }: { publicKey: string; privateKey: string } = await generateKeyPair();

      setPrivateKey(privateKey);
      localStorage.setItem("privateKey", privateKey || "");
      localStorage.setItem("username", username);

      const res: Response = await POST("auth/login", {
        username: await sha256(username),
        password: await sha256(password),
        publicKey,
      });

      if (res.status !== 200) return false;

      const { token }: ApiResponseLogin = await res.json();

      setToken(token);
      localStorage.setItem("token", token || "");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async function fetchUser(token: string): Promise<boolean> {
    try {
      const res = await POST("auth/me", { token });
      if (res.status !== 200) return false;

      const remoteUser: User = await res.json();
      const username: string | null = localStorage.getItem("username");

      // Remote username should be SHA-256 hash of the local username
      if (!username || await sha256(username) !== remoteUser.username) {
        return false;
      }

      remoteUser.username = username;
      setUser(remoteUser);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async function validateSession(): Promise<void> {
    console.log(token, await fetchUser(token!))
    if (token && !await fetchUser(token)) {
      destroySession();
      navigate("/login");
    }
  }

  function destroySession(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("privateKey");
    localStorage.removeItem("username");
    setToken(null);
    setPrivateKey(null);
    setUser(null);
  }

  return { token, createGuest, createAccount, login, user };
}
