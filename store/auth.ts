// src/store/authSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import AuthServer from "@/server/auth"; // Presume que este é o seu serviço de autenticação
import { AuthData, AuthResponse, LoginRequest } from "@/types/auth";
import { RequestResponse } from "@/types/interfaces";

// Tipagem do Estado Inicial (Baseado na sua AuthStore)
interface AuthState {
  data: AuthData | null;
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
  isAuthenticated: boolean;
  isStarted: boolean;
}

// Estado Inicial
const initialState: AuthState = {
  data: null,
  isLoading: false,
  isLoaded: false,
  isError: false,
  isAuthenticated: false,
  isStarted: false,
};

// ----------------------------------------------------
// THUNK (Lógica Assíncrona: Equivalente ao seu método 'login')
// ----------------------------------------------------

// O createAsyncThunk cria as actions de PENDING, FULFILLED e REJECTED
export const login = createAsyncThunk<
  AuthResponse, // Tipo de retorno de sucesso (Payload da action FULFILLED)
  LoginRequest, // Tipo de argumento da função thunk
  { rejectValue: string } // Tipagem extra para o erro (opcional)
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const response: RequestResponse<AuthResponse> = await AuthServer.login(
      payload
    );

    if (response.isSuccess && response.data) {
      return response.data; // Retorna o dado de sucesso
    } else {
      // Se a requisição foi bem-sucedida, mas a lógica de negócio falhou
      return rejectWithValue(
        "Falha de login: Credenciais inválidas ou erro no servidor."
      );
    }
  } catch {
    // Erro de rede ou erro inesperado no AuthServer.login
    return rejectWithValue("Erro de rede ou erro inesperado durante o login.");
  }
});

// ----------------------------------------------------
// SLICE (Estado e Reducers)
// ----------------------------------------------------

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Equivalente à sua ação 'setIsStarted'
    setIsStarted: (state) => {
      state.isStarted = true;
    },
    // Equivalente à sua ação 'setData'
    setData: (state, action: PayloadAction<AuthData>) => {
      state.data = action.payload;
    },
    // Equivalente à sua ação 'logout'
    logout: (state) => {
      // O Zustand usava setTimeout, mas no Redux, o reducer é síncrono.
      // A lógica de resetar o estado é colocada aqui.
      state.data = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isError = false;
    },
  },
  // Reducers extras para lidar com o ciclo de vida do 'createAsyncThunk'
  extraReducers: (builder) => {
    builder
      // LOGIN PENDING
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      // LOGIN FULFILLED (SUCESSO)
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.data = { accessToken: action.payload.accessToken };
          state.isLoaded = true;
          state.isAuthenticated = true;
          state.isError = false;
        }
      )
      // LOGIN REJECTED (FALHA)
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        // Reinicializa o estado de sucesso
        state.data = null;
        state.isAuthenticated = false;
        state.isLoaded = false;
        // O action.payload ou action.error contém a razão da falha
        console.error(
          "Erro de Login:",
          action.payload || action.error?.message
        );
      });
  },
});

export const { setIsStarted, setData, logout } = authSlice.actions;
export default authSlice.reducer;
