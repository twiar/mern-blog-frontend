import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts";
import { imagesReducer } from "./slices/images";
import { authReducer } from "./slices/auth";

const store = configureStore({
	reducer: {
		posts: postsReducer,
		images: imagesReducer,
		auth: authReducer,
	},
});

export default store;
