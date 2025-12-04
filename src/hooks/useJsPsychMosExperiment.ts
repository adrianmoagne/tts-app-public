import { useEffect, useRef, useState, useCallback } from "react";
import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import surveyLikert from "@jspsych/plugin-survey-likert";
import { ExperimentService } from "@/api/services";
import { processExperimentResults } from "@/utils";
import type { IScreen } from "@/@types";
import { createLeuxRadioTrial } from "@/utils/jsPsychPlugins";

export interface Participant {
	name: string;
	email: string;
}

export interface UseJsPsychMosExperimentOptions {
	experimentId: string;
	participantToken?: string;
	participant?: Participant;
	isPreview?: boolean;
	onFinish?: (results: any) => void;
}

export interface UseJsPsychMosExperimentReturn {
	containerRef: React.RefObject<HTMLDivElement | null>;
	isLoading: boolean;
	isFinished: boolean;
	error: string | null;
	screens: IScreen[] | null;
	startExperiment: () => void;
}

export const useJsPsychMosExperiment = ({
	experimentId,
	participantToken,
	participant,
	isPreview = false,
	onFinish,
}: UseJsPsychMosExperimentOptions): UseJsPsychMosExperimentReturn => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const jsPsychRef = useRef<ReturnType<typeof initJsPsych> | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isFinished, setIsFinished] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [screens, setScreens] = useState<IScreen[] | null>(null);
	const [shouldStart, setShouldStart] = useState(false);

	// Fetch experiment data
	useEffect(() => {
		let isMounted = true;

		const fetchExperiment = async () => {
			try {
				setIsLoading(true);
				const res = participantToken
					? await ExperimentService.fetchExperimentForParticipant(experimentId, participantToken)
					: await ExperimentService.fetchExperimentById(experimentId);

				if (!isMounted) return;

				const experimentData = res.data?.data;
				if (!experimentData?.screens) {
					setError("No screens found in experiment");
					return;
				}

				setScreens(experimentData.screens);
				setIsLoading(false);
			} catch (err) {
				if (!isMounted) return;
				console.error("Error fetching experiment:", err);
				setError("Failed to load experiment");
				setIsLoading(false);
			}
		};

		fetchExperiment();

		return () => {
			isMounted = false;
		};
	}, [experimentId, participantToken]);

	// Build and run the jsPsych timeline
	useEffect(() => {
		if (!shouldStart || !screens) return;

		const currentContainer = containerRef.current;
		if (!currentContainer) return;

		currentContainer.innerHTML = "";

		const jsPsych = initJsPsych({
			display_element: currentContainer,
			on_finish: () => {
				const resultJson = processExperimentResults(jsPsych.data.get(), experimentId);

				if (isPreview) {
					// downloadJson(resultJson, `experiment_${experimentId}_results.json`);
					console.log(resultJson);
				}

				if (onFinish) {
					onFinish(resultJson);
				}

				setIsFinished(true);
			},
		});

		jsPsychRef.current = jsPsych;

		// Add participant data if available
		if (participant) {
			jsPsych.data.addProperties({
				participantName: participant.name,
				participantEmail: participant.email,
			});
		} else if (isPreview) {
			jsPsych.data.addProperties({
				participantName: "Preview User",
				participantEmail: "preview@example.com",
				isPreview: true,
			});
		}

		const timeline: any[] = [];
		const LeuxRadioTrial = createLeuxRadioTrial(jsPsych);

		screens.forEach((screen: IScreen) => {
			const audioItem = screen.items.find(
				(item) =>
					item.type === "media" &&
					typeof item.media !== "string" &&
					item.media?.type === "audio"
			);

			if (!audioItem || typeof audioItem.media === "string" || !audioItem.media) return;

			const audioSource = audioItem.media.src;
			if (!audioSource) return;

			const trial = {
				type: LeuxRadioTrial,
				audioSource,
				prompt: "Please rate the quality from 1 (Bad) to 5 (Excellent)",
				scale: ["1 - Bad", "2 - Poor", "3 - Fair", "4 - Good", "5 - Excellent"],
				data: {
					screenId: screen._id,
					audioId: audioItem.media._id,
				},
			};

			timeline.push(trial);
		});

		// Add feedback survey at the end
		const feedbackTrial = {
			type: surveyLikert,
			questions: [
				{
					prompt: "A execucao desta avaliacao foi uma experiência agradável",
					name: "user_experience",
					labels: ["1", "2", "3", "4", "5"],
				},
				{
					prompt: "As instrucoes deste método foram claras e fáceis de entender",
					name: "instruction_clarity",
					labels: ["1", "2", "3", "4", "5"],
				},
				{
					prompt: "Foi fácil realizar este método de avaliação sem cometer erros",
					name: "error_ease",
					labels: ["1", "2", "3", "4", "5"],
				},
				{
					prompt: "O tempo necessário para completar esta avaliação foi adequado",
					name: "time_adequacy",
					labels: ["1", "2", "3", "4", "5"],
				},
				{
					prompt: "Esse método de avaliação gerou cansaco fisico ou mental para ser concluído",
					name: "physical_mental_fatigue",
					labels: ["1", "2", "3", "4", "5"],
				},
			],
		};

		timeline.push(feedbackTrial);
		jsPsych.run(timeline);

		return () => {
			jsPsychRef.current?.pluginAPI?.cancelAllKeyboardResponses?.();
			jsPsychRef.current?.pluginAPI?.clearAllTimeouts?.();
			if (currentContainer) {
				currentContainer.innerHTML = "";
			}
		};
	}, [shouldStart, screens, experimentId, participant, isPreview, onFinish]);

	const startExperiment = useCallback(() => {
		setShouldStart(true);
	}, []);

	return {
		containerRef,
		isLoading,
		isFinished,
		error,
		screens,
		startExperiment,
	};
};

export default useJsPsychMosExperiment;
