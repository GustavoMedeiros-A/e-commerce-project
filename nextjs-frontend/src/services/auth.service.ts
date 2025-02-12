import { cookies } from "next/headers";

export class AuthService {
  async login(input: { email: string; password: string }) {
    const response = await fetch(`${process.env.ORDERS_API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        username: input.email,
        password: input.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      return { error: "Credenciais inválidas" };
    }

    if (!response.ok) {
      const error = await response.json();
      return { error };
    }

    const data = await response.json();

    const cookieStore = await cookies()
    
    cookieStore.set("token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return { success: true };
  }

  async logout() {
    const cookiesStore = await cookies()
    cookiesStore.delete("token")
  }

  async getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const payloadBase64 = token.split(".")[1];
    const payloadDecoded = atob(payloadBase64);
    return JSON.parse(payloadDecoded);
  }

  async getToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    return token;
  }

  async isTokenExpired() {
    const user = await this.getUser();

    if (!user) {
      return true;
    }

    const now = new Date();
    const exp = new Date(user.exp * 1000);

    return now > exp;
  }
}
