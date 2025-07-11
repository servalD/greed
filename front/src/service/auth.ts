"use client";

import { get, post } from "@/utils/api";
import { LoginPayload } from "thirdweb/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000";

interface GeneratePayloadParams {
  address: string;
  chainId?: number;
}

interface LoginParams {
  nonce: string;
  signature: string;
}

interface LoginResponse {
  token: string;
  refresh_token: string;
  user: any;
}

// Génère le payload SIWE depuis le backend
export async function generatePayload(params: GeneratePayloadParams) {
  try {
    const data = await post <LoginPayload>(`/siwe/generate`, {
        eth_address: params.address,
        chain_id: params.chainId || 11155111, // Sepolia par défaut, ajustez si nécessaire
      })
    // ThirdWeb attend un payload avec ces champs spécifiques selon l'interface LoginPayload
    return data;
  } catch (error) {
    console.error("Erreur lors de la génération du payload:", error);
    throw error;
  }
}

// Effectue le login avec la signature
export async function login(params: LoginParams) {
  try {

    const data = await post<LoginResponse>(`/siwe/login`, {
      nonce: params.nonce,
      signature:  params.signature,
    })

    return data
    // ThirdWeb attend void en retour
  } catch (error) {
    console.error("Erreur lors du login:", error);
    throw error;
  }
}

// Vérifie si l'utilisateur est connecté
export async function getUser() {
  try {
    const accessToken = cookieStore.get("jwt");

    if (!accessToken) {
      return null;
    }

    const response = await get(`/user`);

    return response
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
}

// Effectue la déconnexion
export async function logout() {
  try {
    const refreshToken = localStorage.getItem("refresh_token")
    // Informer le backend de la déconnexion
    if (refreshToken) {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      });
    }

    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    localStorage.removeItem("refresh_token");

    // ThirdWeb attend void en retour
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    throw error;
  }
}
