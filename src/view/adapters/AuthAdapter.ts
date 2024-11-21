import { UserData } from "../../model/entities/UserData.js";
import Utils from "../scripts/config.js";

export class AuthAdapter {
  protected endpoint: string;
  protected utils: Utils;

  constructor(utils: Utils = Utils.instance) {
    this.utils = utils; // Permite inyectar dependencias para pruebas.
    this.endpoint = "auth";
  }

  async auth(
    user_name: string,
    user_password: string,
  ): Promise<UserData | null> {
    const url = `${this.utils.apiUrl}/${this.endpoint}`;
    const body = JSON.stringify({ user_name, user_password });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (response.status === 404) return null;

    let responseText: string;
    try {
      responseText = await response.text();
    } catch (err) {
      throw new Error("Error al leer la respuesta del servidor.");
    }

    if (response.status >= 400) {
      try {
        const err = JSON.parse(responseText);
        throw new Error(err.message || "Error desconocido del servidor.");
      } catch {
        throw new Error("Error desconocido del servidor.");
      }
    }

    try {
      return JSON.parse(responseText) as UserData;
    } catch {
      throw new Error("Respuesta del servidor inválida.");
    }
  }

  public setCookie(value: unknown, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Expiración en días
    const expires = "expires=" + date.toUTCString();
    document.cookie = `userData=${value}; ${expires}; path=/`; // El "path=/" asegura que la cookie esté disponible en todo el sitio
  }

  public getCookie() {
    const nameEQ = "userData" + "=";
    const cookies = document.cookie.split(";"); // Divide las cookies en un array
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim(); // Elimina espacios
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length); // Retorna el valor de la cookie
      }
    }
    return null; // Si no se encuentra la cookie
  }

  public deleteCookie() {
    document.cookie = `userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }
}
