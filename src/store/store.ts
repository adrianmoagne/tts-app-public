import { configureStore } from "@reduxjs/toolkit";
import {
	mediaUploadReducer,
	mediaViewerReducer,
	sidebarReducer,
	addItemReducer,
	createScreenReducer,
	templateViewerReducer,
	setupNewScreenReducer,
	authReducer,
	projectReducer,
} from "./Slices";
const reducers = {
	mediaViewer: mediaViewerReducer,
	sidebar: sidebarReducer,
	mediaUpload: mediaUploadReducer,
	addItem: addItemReducer,
	createScreen: createScreenReducer,
	templateViewer: templateViewerReducer,
	setupNewScreen: setupNewScreenReducer,
	auth: authReducer,
	project: projectReducer,
};

const store = configureStore({
	reducer: reducers,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;

export default store;
