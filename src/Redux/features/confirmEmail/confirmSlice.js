import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for confirming email
export const confirmEmail = createAsyncThunk(
    'auth/confirmEmail',
    async (formsData, { rejectWithValue }) => {
        try {
            console.log("Confirming email with:", formsData);

            const response = await axios.post(
                'http://e-learn-v1.runasp.net/api/Auth/confirm-email',
                {}, // empty body
                {
                    params: {
                        userId: formsData.userId,
                        token: formsData.token,
                    },
                }
            );

            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.status === 409) {
                    return rejectWithValue("The email or other data is duplicate.");
                } else {
                    return rejectWithValue(error.response.data.message || "There was an error");
                }
            } else if (error.message) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("Something went wrong");
            }
        }
    }
);

// Slice for confirmEmail
const confirmSlice = createSlice({
    name: 'confirmEmail',
    initialState: {
        loading: false,
        error: null,
        success: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(confirmEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(confirmEmail.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(confirmEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    }
});

export default confirmSlice.reducer;
