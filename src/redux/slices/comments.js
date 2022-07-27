import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchComments = createAsyncThunk("posts/fetchComments", async (postId) => {
	const { data } = await axios.get(`/posts/${postId}/comments`);
	return data;
});

const initialState = {
	comments: {
		items: [],
		status: "loading",
	},
};

const commentsSlice = createSlice({
	name: "comments",
	initialState,
	reducers: {},
	extraReducers: {
		// Получение статей
		[fetchComments.pending]: (state) => {
			state.comments.items = [];
			state.comments.status = "loading";
		},
		[fetchComments.fulfilled]: (state, action) => {
			state.comments.items = action.payload;
			state.comments.status = "loaded";
		},
		[fetchComments.rejected]: (state) => {
			state.comments.items = [];
			state.comments.status = "error";
		},
	},
});

export const commentsReducer = commentsSlice.reducer;
