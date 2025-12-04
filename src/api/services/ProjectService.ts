import type { AxiosResponse } from "axios";
import { api } from "../api";
import { Endpoints } from "../endpoints";

const fetchAllProjects = async (): Promise<AxiosResponse> => {
	const res = await api.get(Endpoints.Projects);
	return res.data;
};

const createProject = async ({
	alias,
	description,
}: {
	alias: string;
	description?: string;
}): Promise<AxiosResponse> => {
	const res = await api.post(Endpoints.Projects, {
		alias,
		description,
	});
	return res;
};

export const ProjectService = {
	fetchAllProjects,
	createProject,
};
