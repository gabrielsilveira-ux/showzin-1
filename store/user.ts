import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import AuthServer from "@/server/auth";
import { AuthUserData } from "@/types/auth";
import { RequestResponse } from "@/types/interfaces";

interface UserState {
  data: AuthUserData | null;
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
}

const initialState: UserState = {
  data: null,
  isLoading: false,
  isLoaded: false,
  isError: false,
};

export const fetchUser = createAsyncThunk<
  AuthUserData,
  void,
  { rejectValue: string }
>("user/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const response: RequestResponse<AuthUserData> = await AuthServer.getUser();

    if (response.isSuccess && response.data) {
      return response.data;
    } else {
      return rejectWithValue("Failed to fetch user data");
    }
  } catch {
    return rejectWithValue("Network error while fetching user data");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUserData>) => {
      state.data = action.payload;
      state.isLoaded = true;
    },
    cleanUser: (state) => {
      state.data = null;
      state.isLoading = false;
      state.isLoaded = false;
      state.isError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<AuthUserData>) => {
          state.isLoading = false;
          state.data = action.payload;
          state.isLoaded = true;
          state.isError = false;
        }
      )
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.data = null;
        state.isLoaded = false;
        console.error(
          "Error fetching user:",
          action.payload || action.error?.message
        );
      });
  },
});

export const { setUser, cleanUser } = userSlice.actions;
export default userSlice.reducer;
