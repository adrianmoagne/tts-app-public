import type { AxiosResponse } from "axios";
import { api } from "../api";
import { Endpoints } from "../endpoints";

interface InvitationResult {
	success: boolean;
	message: string;
	sent: string[];
	failed: string[];
}

interface Participant {
	email: string;
	token: string;
	status: "invited" | "started" | "completed";
	invitedAt: string;
	startedAt?: string;
	completedAt?: string;
}

const fetchAllExperiments = async (): Promise<AxiosResponse> => {
	const res = await api.get(Endpoints.Experiments);
	return res;
};

const createExperiment = async (payload: Record<string, unknown>): Promise<AxiosResponse> => {
	const res = await api.post(Endpoints.Experiments, payload);
	return res;
};

const fetchExperimentById = async (experimentId: string): Promise<AxiosResponse> => {
	const res = await api.get(Endpoints.ExperimentById.replace(":id", experimentId));
	return res;
};

const deleteExperimentById = async (experimentId: string): Promise<AxiosResponse> => {
	const res = await api.delete(Endpoints.ExperimentById.replace(":id", experimentId));
	return res;
};

const sendInvitations = async (
	experimentId: string,
	emails: string[]
): Promise<AxiosResponse<InvitationResult>> => {
	const res = await api.post<InvitationResult>(
		Endpoints.ExperimentInvite.replace(":id", experimentId),
		{ emails }
	);
	return res;
};

const fetchParticipants = async (
	experimentId: string
): Promise<AxiosResponse<{ success: boolean; data: Participant[] }>> => {
	const res = await api.get(Endpoints.ExperimentParticipants.replace(":id", experimentId));
	return res;
};

// Public endpoint for participants (no auth required)
const fetchExperimentForParticipant = async (
	experimentId: string,
	token?: string
): Promise<AxiosResponse> => {
	const url = Endpoints.ExperimentPublicRun.replace(":id", experimentId);
	const res = await api.get(url, {
		params: token ? { token } : undefined,
	});
	return res;
};

export const ExperimentService = {
	fetchAllExperiments,
	createExperiment,
	fetchExperimentById,
	deleteExperimentById,
	sendInvitations,
	fetchParticipants,
	fetchExperimentForParticipant,
};
