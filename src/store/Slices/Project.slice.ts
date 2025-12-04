import type { GenericAction, IProject } from "@/@types";
import { ProjectService } from "@/api/services/ProjectService";
import { ExperimentService } from "@/api/services/ExperimentService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface ProjectState {
	projects: IProject[];
	loading: boolean;
	deleting: boolean;
	error: string | null;
}
const initialState: ProjectState = {
	projects: [],
	loading: false,
	deleting: false,
	error: null,
};

export const fetchProjects = createAsyncThunk("project/fetchProjects", async () => {
	const res = await ProjectService.fetchAllProjects();
	return res.data;
});

export const createProject = createAsyncThunk(
	"project/createProject",
	async ({ alias, description }: { alias: string; description: string }) => {
		const res = await ProjectService.createProject({ alias, description });
		return res.data;
	}
);

export const deleteExperiment = createAsyncThunk(
	"project/deleteExperiment",
	async (experimentId: string) => {
		await ExperimentService.deleteExperimentById(experimentId);
		return experimentId;
	}
);

const ProjectSlice = createSlice({
	name: "Project",
	initialState,
	reducers: {
		setProjects(state, action: GenericAction<IProject[]>) {
			state.projects = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProjects.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchProjects.fulfilled, (state, action) => {
				state.loading = false;
				state.projects = action.payload;
			})
			.addCase(fetchProjects.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error?.message ?? "Failed to fetch projects";
			})
			.addCase(createProject.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createProject.fulfilled, (state, action) => {
				state.loading = false;
				console.log("Created project payload:", action.payload);
				state.projects = [...state.projects, action.payload.data];
			})
			.addCase(createProject.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error?.message ?? "Failed to create project";
			})
			.addCase(deleteExperiment.pending, (state) => {
				state.deleting = true;
				state.error = null;
			})
			.addCase(deleteExperiment.fulfilled, (state, action) => {
				state.deleting = false;
				const experimentId = action.payload;
				state.projects = state.projects.map((project) => ({
					...project,
					experiments: project.experiments.filter((exp) => exp._id !== experimentId),
				}));
			})
			.addCase(deleteExperiment.rejected, (state, action) => {
				state.deleting = false;
				state.error = action.error?.message ?? "Failed to delete experiment";
			});
	},
});

export const projectActions = {
	...ProjectSlice.actions,
	fetchProjects,
	createProject,
	deleteExperiment,
};
export const projectReducer = ProjectSlice.reducer;
