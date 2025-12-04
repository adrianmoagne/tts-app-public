import type { GenericAction, ScreenItem, ScreenState } from "@/@types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ScreenState = {
	gridType: "3x3",
	gridSubtype: "equal",
	items: [],
};

const createScreenSlice = createSlice({
	name: "CreateScreen",
	initialState,
	reducers: {
		setGridType: (state, action: GenericAction<ScreenState["gridType"]>) => {
			state.gridType = action.payload;
		},
		setGridSubtype: (state, action: GenericAction<ScreenState["gridSubtype"]>) => {
			state.gridSubtype = action.payload;
		},
		addItem: (state, action: GenericAction<ScreenItem>) => {
			state.items.push(action.payload);
		},
		reset: (state) => {
			state.gridType = initialState.gridType;
			state.gridSubtype = initialState.gridSubtype;
			state.items = [];
		},
	},
});

export const createScreenActions = createScreenSlice.actions;

export const createScreenReducer = createScreenSlice.reducer;
