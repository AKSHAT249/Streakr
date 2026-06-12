import { createSlice } from '@reduxjs/toolkit';

const currentUserSlice = createSlice({
    name:'currentUser',
    initialState: {
        user:null
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.user = action.payload
        },
        clearCurrentUser: (state) => {
            state.user = null;
        }

    }
});

export const { setCurrentUser, clearCurrentUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;