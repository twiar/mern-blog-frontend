import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchRemoveImage = createAsyncThunk("uploads/fetchRemoveImage", async (imgName) => {
	return await axios.delete(`/uploads/${imgName}`);
});

const initialState = {
	images: {
		items: [],
		status: "loading",
	},
};

const imagesSlice = createSlice({
	name: "images",
	initialState,
	reducers: {},
	extraReducers: {
		// Удаление картинки
		[fetchRemoveImage.pending]: (state, action) => {
			state.images.items = state.images.items.filter((obj) => obj._id !== action.meta.arg);
		},
	},
});

export const imagesReducer = imagesSlice.reducer;
