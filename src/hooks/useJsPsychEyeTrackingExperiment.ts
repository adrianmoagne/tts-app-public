import { useEffect, useRef, useState, useCallback } from "react";
import { initJsPsych } from "jspsych";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import "jspsych/css/jspsych.css";
import jsPsychExtensionWebgazer from "@jspsych/extension-webgazer";
import webgazerInitCamera from "@jspsych/plugin-webgazer-init-camera";
import webgazerCalibrate from "@jspsych/plugin-webgazer-calibrate";
import audioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import webgazerValidate from "@jspsych/plugin-webgazer-validate";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import surveyText from "@jspsych/plugin-survey-text";
import { ExperimentService } from "@/api/services";
import { loadWebGazer, generateScreenHtml, processExperimentResults, downloadJson } from "@/utils";
import type { IScreen } from "@/@types";

export interface Participant {
	name: string;
	email: string;
}

export interface UseJsPsychEyeTrackingOptions {
	experimentId: string;
	participantToken?: string;
	participant?: Participant;
	isPreview?: boolean;
	skipParticipantForm?: boolean;
	onFinish?: (results: any) => void;
}

export interface UseJsPsychEyeTrackingReturn {
	containerRef: React.RefObject<HTMLDivElement | null>;
	isLoading: boolean;
	isFinished: boolean;
	error: string | null;
	startExperiment: () => void;
}

export const useJsPsychEyeTrackingExperiment = ({
	experimentId,
	participantToken,
	participant,
	isPreview = false,
	skipParticipantForm = false,
	onFinish,
}: UseJsPsychEyeTrackingOptions): UseJsPsychEyeTrackingReturn => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const jsPsychRef = useRef<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isFinished, setIsFinished] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [shouldStart, setShouldStart] = useState(false);
	
	// Use refs for values that shouldn't trigger effect re-runs
	const onFinishRef = useRef(onFinish);
	const participantRef = useRef(participant);
	
	// Keep refs updated
	useEffect(() => {
		onFinishRef.current = onFinish;
	}, [onFinish]);
	
	useEffect(() => {
		participantRef.current = participant;
	}, [participant]);

	useEffect(() => {
		if (!shouldStart) return;

		const currentContainer = containerRef.current;
		let isMounted = true;
		// let gazeDot: HTMLDivElement | null = null;

		const runExperiment = async () => {
			if (!currentContainer) return;

			try {
				setIsLoading(true);
				await loadWebGazer();

				const jsPsych = initJsPsych({
					display_element: currentContainer,
					extensions: [{ type: jsPsychExtensionWebgazer }],
					on_finish: () => {
						const resultJson = processExperimentResults(jsPsych.data.get(), experimentId);

						if (!isPreview) {
							downloadJson(resultJson, `experiment_${experimentId}_results.json`);
						}

						console.log("Final Experiment JSON:", resultJson);

						// Analyze the data
						const data = jsPsych.data.get().values();
						data.forEach((trial) => {
							if (trial.webgazer_data && trial.webgazer_targets) {
								const targets = Object.keys(trial.webgazer_targets);
								targets.forEach((targetSelector) => {
									const box = trial.webgazer_targets[targetSelector];
									const gazePoints = trial.webgazer_data;
									let hits = 0;
									gazePoints.forEach((point: any) => {
										if (
											point.x >= box.left &&
											point.x <= box.right &&
											point.y >= box.top &&
											point.y <= box.bottom
										) {
											hits++;
										}
									});
									const percentage = (hits / gazePoints.length) * 100;
									console.log(
										`Trial ${trial.trial_index}: User looked at ${targetSelector} for ${percentage.toFixed(2)}% of the time.`
									);
								});
							}
						});

						if (currentContainer) {
							currentContainer.innerHTML = "";
						}

						if (onFinishRef.current) {
							onFinishRef.current(resultJson);
						}

						setIsFinished(true);
					},
				});

				jsPsychRef.current = jsPsych;

				// Add participant data if available
				if (participantRef.current) {
					jsPsych.data.addProperties({
						participantName: participantRef.current.name,
						participantEmail: participantRef.current.email,
					});
				} else if (isPreview) {
					jsPsych.data.addProperties({
						participantName: "Preview User",
						participantEmail: "preview@example.com",
						isPreview: true,
					});
				}

				// Create gaze dot for visualization
				// gazeDot = document.createElement("div");
				// gazeDot.id = "custom-gaze-dot";
				// Object.assign(gazeDot.style, {
				// 	position: "fixed",
				// 	width: "12px",
				// 	height: "12px",
				// 	borderRadius: "50%",
				// 	background: "red",
				// 	pointerEvents: "none",
				// 	zIndex: "99999",
				// 	transform: "translate(-50%, -50%)",
				// 	display: "none",
				// });
				// document.body.appendChild(gazeDot);

				const timeline: any[] = [];

				// Welcome screen
				const welcome = {
					type: htmlKeyboardResponse,
					stimulus: "<p>Welcome to the experiment.<br>Press any key to begin.</p>",
				};

				// Participant form (only if not skipped)
				const participantForm = {
					type: surveyText,
					questions: [
						{ prompt: "Full Name:", name: "name", required: true },
						{
							prompt: "Email Address:",
							name: "email",
							required: true,
							placeholder: "example@email.com",
						},
					],
					data: {
						task: "participant_info",
					},
				};

				// Camera initialization
				const initCamera = {
					type: webgazerInitCamera,
					instructions: `<p>Position your head so that your face is centered in the box and green.</p>`,
					// on_start: () => {
					// 	if (window.webgazer && gazeDot) {
					// 		(jsPsych.extensions.webgazer as any).onGazeUpdate(
					// 			(prediction: { x: number; y: number } | null) => {
					// 				if (!prediction || !gazeDot) {
					// 					if (gazeDot) gazeDot.style.display = "none";
					// 					return;
					// 				}
					// 				gazeDot.style.display = "block";
					// 				gazeDot.style.left = `${prediction.x}px`;
					// 				gazeDot.style.top = `${prediction.y}px`;
					// 			}
					// 		);
					// 	}
					// },
				};

				// Calibration
				const calibration = {
					type: webgazerCalibrate,
					calibration_points: [
						[25, 25],
						[75, 25],
						[50, 50],
						[25, 75],
						[75, 75],
					],
					calibration_mode: "view",
					repetitions_per_point: 2,
					randomize_calibration_order: true,
					// on_start: () => {
					// 	if (gazeDot) gazeDot.style.display = "none";
					// 	if (window.webgazer) {
					// 		(jsPsych.extensions.webgazer as any).showPredictions(true);
					// 	}
					// },
				};

				// Validation instructions
				const validation_instructions = {
					type: htmlButtonResponse,
					stimulus: `
						<p>Now we'll measure the accuracy of the calibration.</p>
						<p>Look at each dot as it appears on the screen.</p>
						<p style="font-weight: bold;">You do not need to click on the dots this time.</p>
					`,
					choices: ["Got it"],
					post_trial_gap: 1000,
				};

				// Validation
				const validation = {
					type: webgazerValidate,
					validation_points: [
						[25, 25],
						[75, 25],
						[50, 50],
						[25, 75],
						[75, 75],
					],
					roi_radius: 200,
					time_to_saccade: 1000,
					validation_duration: 2000,
					data: {
						task: "validate",
					},
				};

				// Recalibration instructions
				const recalibrate_instructions = {
					type: htmlButtonResponse,
					stimulus: `
						<p>The accuracy of the calibration is a little lower than we'd like.</p>
						<p>Let's try calibrating one more time.</p>
						<p>On the next screen, look at the dots and click on them.</p>
					`,
					choices: ["OK"],
				};

				// Recalibration conditional
				const recalibrate = {
					timeline: [recalibrate_instructions, calibration, validation_instructions, validation],
					conditional_function: function () {
						const validation_data = jsPsych.data.get().filter({ task: "validate" }).values()[0];
						return validation_data.percent_in_roi.some(function (x: number) {
							const minimum_percent_acceptable = 50;
							return x < minimum_percent_acceptable;
						});
					},
					data: {
						phase: "recalibration",
					},
				};

				// Calibration done
				const calibration_done = {
					type: htmlButtonResponse,
					stimulus: `<p>Great, we're done with calibration!</p>`,
					choices: ["OK"],
				};

				// Build initial timeline
				timeline.push(welcome);
				if (!skipParticipantForm && !isPreview) {
					timeline.push(participantForm);
				}
				timeline.push(
					initCamera,
					calibration,
					validation_instructions,
					validation,
					recalibrate,
					calibration_done
				);

				// Fetch experiment screens
				const res = participantToken
					? await ExperimentService.fetchExperimentForParticipant(experimentId, participantToken)
					: await ExperimentService.fetchExperimentById(experimentId);

				if (!isMounted) return;

				const experimentData = res.data?.data;
				if (!experimentData?.screens) {
					setError("No screens found in experiment");
					setIsLoading(false);
					return;
				}

				// Fisher-Yates shuffle algorithm to randomize screen order
				const shuffleArray = <T,>(array: T[]): T[] => {
					const shuffled = [...array];
					for (let i = shuffled.length - 1; i > 0; i--) {
						const j = Math.floor(Math.random() * (i + 1));
						[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
					}
					return shuffled;
				};

				// Randomize screen order for this participant
				const randomizedScreens: IScreen[] = shuffleArray(experimentData.screens);

				// Add experiment trials
				randomizedScreens.forEach((screen: IScreen) => {
					const targets = screen.items
						.filter(
							(item) =>
								item.type === "media" &&
								typeof item.media !== "string" &&
								item.media?.type === "picture"
						)
						.map((item) => `#item-${item.media?._id}`);

					const audioItem = screen.items.find(
						(item) =>
							item.type === "media" &&
							typeof item.media !== "string" &&
							item.media?.type === "audio"
					);

					// Skip if no audio or media is not properly defined
					if (!audioItem || typeof audioItem.media === "string" || !audioItem.media) {
						return;
					}

					const audioSource = audioItem.media.src;

					const visualHtml = generateScreenHtml(screen);

				const fixation = {
					type: htmlKeyboardResponse,
					stimulus: '<div style="width: 100vw; height: calc(100vh - 50px); display: flex; justify-content: center; align-items: center; font-size: 200px; overflow: hidden;">+</div>',
					choices: "NO_KEYS",
					trial_duration: 3000,
				};

					let trial: any;
					if (audioSource) {
						trial = {
							type: audioKeyboardResponse,
							stimulus: audioSource,
							choices: "NO_KEYS",
							trial_ends_after_audio: true,
							prompt: visualHtml,
							data: { screenId: screen._id },
							extensions: [
								{
									type: jsPsychExtensionWebgazer,
									params: { targets },
								},
							],
						};
					}

					timeline.push(fixation, trial);
				});

				setIsLoading(false);
				await jsPsych.run(timeline);
			} catch (err) {
				console.error("Failed to initialize experiment:", err);
				setError("Failed to initialize experiment");
				setIsLoading(false);
			}
		};

		runExperiment();

		return () => {
			console.log("Ending webgazer");
			isMounted = false;

			if (currentContainer) {
				currentContainer.innerHTML = "";
			}

			jsPsychRef.current?.pluginAPI?.cancelAllKeyboardResponses?.();
			jsPsychRef.current?.pluginAPI?.clearAllTimeouts?.();

			try {
				if (window.webgazer) {
					// Pause webgazer instead of ending it to avoid DOM errors
					try {
						window.webgazer.pause();
						// Clear regression data
						if (window.webgazer.clearData) {
							window.webgazer.clearData();
						}
					} catch (e) {
						console.error("Error pausing webgazer:", e);
					}
				}

				// Stop video tracks
				const videoElement = document.getElementById("webgazerVideoFeed") as HTMLVideoElement;
				if (videoElement && videoElement.srcObject) {
					const stream = videoElement.srcObject as MediaStream;
					const tracks = stream.getTracks();
					tracks.forEach((track) => track.stop());
					videoElement.srcObject = null;
				}

				// Remove all webgazer-related DOM elements
				const elementsToRemove = [
					"custom-gaze-dot",
					"webgazerVideoFeed", 
					"webgazerFaceOverlay", 
					"webgazerFaceFeedbackBox",
					"webgazerVideoContainer",
					"webgazerGazeDot"
				];
				
				elementsToRemove.forEach((id) => {
					const el = document.getElementById(id);
					if (el && el.parentNode) {
						try {
							el.parentNode.removeChild(el);
						} catch (e) {
							// Element might already be removed, ignore
						}
					}
				});
			} catch (e) {
				console.log("Cleanup error:", e);
			}
		};
	}, [shouldStart, experimentId, participantToken, isPreview, skipParticipantForm]);

	const startExperiment = useCallback(() => {
		setShouldStart(true);
	}, []);

	return {
		containerRef,
		isLoading,
		isFinished,
		error,
		startExperiment,
	};
};

export default useJsPsychEyeTrackingExperiment;
