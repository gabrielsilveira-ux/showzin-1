import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this"
);

export interface UserJWTPayload {
  userId: number;
  email: string;
  type: string;
}

// Gerar token JWT
export async function generateToken(payload: UserJWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

// Verificar token JWT
export async function verifyToken(
  token: string
): Promise<UserJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Validar que o payload contém os campos necessários
    if (
      typeof payload.userId === "number" &&
      typeof payload.email === "string" &&
      typeof payload.type === "string"
    ) {
      return {
        userId: payload.userId,
        email: payload.email,
        type: payload.type,
      };
    }

    return null;
  } catch (error) {
    console.error("Error verifying token", error);
    return null;
  }
}

// Hash de senha
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Verificar senha
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Extrair token do header
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

// Proxy de autenticação
export async function authenticate(
  request: NextRequest
): Promise<UserJWTPayload | null> {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return await verifyToken(token);
}

// Verificar se é admin
export function isAdmin(user: UserJWTPayload): boolean {
  return user.type === "admin";
}
