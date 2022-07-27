import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts";
import { commentsReducer } from "./slices/comments";
import { imagesReducer } from "./slices/images";
import { authReducer } from "./slices/auth";

const store = configureStore({
	reducer: {
		posts: postsReducer,
		comments: commentsReducer,
		images: imagesReducer,
		auth: authReducer,
	},
});

export default store;
