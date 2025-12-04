import type { HAlign, IMedia, IScreen, ScreenItem, VAlign } from "@/@types";

export const loadWebGazer = () => {
	return new Promise<void>((resolve, reject) => {
		if (window.webgazer) {
			resolve();
			return;
		}
		const script = document.createElement("script");
		script.src =
			"https://cdn.jsdelivr.net/gh/jspsych/jspsych@jspsych@7.0.0/examples/js/webgazer/webgazer.js";
		script.async = true;
		script.onload = () => {
			// CLEAR DATA immediately after loading
			if (window.webgazer) {
				window.webgazer.clearData();
			}
			resolve();
		};
		script.onerror = () => reject(new Error("Failed to load WebGazer script"));
		document.head.appendChild(script);
	});
};

export const getJustifyContent = (h: HAlign): string => {
	switch (h) {
		case "left":
			return "flex-start";
		case "right":
			return "flex-end";
		case "center":
		default:
			return "center";
	}
};

export const getAlignItems = (v: VAlign): string => {
	switch (v) {
		case "top":
			return "flex-start";
		case "bottom":
			return "flex-end";
		case "center":
		default:
			return "center";
	}
};

export const renderMedia = (media: IMedia, itemId: string) => {
	if (media.type === "picture") {
		console.log("itemId", itemId);
		return `<img id="item-${itemId}" src="${media.src}" alt="${media.filename}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;" />`;
	}

	if (media.type === "audio") {
		console.log("itemId", itemId);
		return ""; // Audio is handled by audioKeyboardResponse plugin
	}
	return "";
};

export const renderScreenItem = (item: ScreenItem, maxRowsCols: number) => {
	// Grid mapping: area (heading/content/footer) x position (left/center/right)
	let row: number;
	if (item.area === "heading") row = 1;
	else if (item.area === "content") row = 2;
	else row = 3;

	let col: number;
	if (item.position === "left") col = 1;
	else if (item.position === "center") col = 2;
	else col = 3;

	// Ensure we don't place items outside the defined grid (e.g. Row 3 in a 2x2 grid)
	row = Math.min(row, maxRowsCols);
	col = Math.min(col, maxRowsCols);

	const justifyContent = getJustifyContent(item.h_align);
	const alignItems = getAlignItems(item.v_align);

	let inner = "";
	if (item.type === "media" && item.media && typeof item.media !== "string") {
		inner = renderMedia(item.media, item.media._id);
	} else if (item.type === "text") {
		inner = `<div>Text item: ${item._id}</div>`;
	} else if (item.type === "template") {
		// Placeholder for template; can be improved when you bind medias to templates
		inner = `<div style="opacity: 0.7; font-size: 12px;">${item.template_type || "template"}</div>`;
	}

	return `
    <div
      style="
        grid-row: ${row};
        grid-column: ${col};
        display: flex;
        justify-content: ${justifyContent};
        align-items: ${alignItems};
        box-sizing: border-box;
				overflow: hidden;
				min-width: 0;
				min-height: 0;
				width: 100%;
				height: 100%;
      "
    >
      ${inner}
    </div>
  `;
};

export const generateScreenHtml = (screen: IScreen) => {
	// Determine grid size based on type (1x1, 2x2, or default 3x3)
	const gridSize = screen.grid.type === "1x1" ? 1 : screen.grid.type === "2x2" ? 2 : 3;
	const maxRowsCols = gridSize;

	const itemsHtml = screen.items.map((item) => renderScreenItem(item, maxRowsCols)).join("");

	return `
          <div style="
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: repeat(${maxRowsCols}, 1fr); 
        grid-template-columns: repeat(${maxRowsCols}, 1fr);
        gap: 8px;
        padding: 8px;
        box-sizing: border-box;
        margin: 0;
      ">
        ${itemsHtml}
      </div>
  `;
};

interface GazePoint {
	x: number;
	y: number;
	t: number;
}

interface WebGazerTarget {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

interface JsPsychTrial {
	task?: string;
	screenId?: string;
	trial_index: number;
	trial_type: string;
	stimulus?: string;
	rt?: number;
	response?: unknown;
	webgazer_targets?: Record<string, WebGazerTarget>;
	webgazer_data?: GazePoint[];
	percent_in_roi?: number[];
	average_offset?: number;
	validation_points?: unknown[];
	participantName?: string;
	participantEmail?: string;
	audioId?: string;
}

interface ProcessedTarget {
	selector: string;
	bounding_box: WebGazerTarget;
	fixation_percentage: number;
	hit_count: number;
	total_gaze_points: number;
}

export const processExperimentResults = (
	rawData: { filter: (q: unknown) => { values: () => JsPsychTrial[] } },
	experimentId: string
) => {
	// 1. Extract Calibration Data
	// We filter for 'validate' tasks.
	// Index 0 is initial validation. If there is more than 1, recalibration occurred.
	const validationTrials = rawData.filter({ task: "validate" }).values();
	const initialValidation = validationTrials[0];
	const finalValidation = validationTrials[validationTrials.length - 1];

	const calibrationData = {
		recalibration_performed: validationTrials.length > 1,
		initial_validation: initialValidation
			? {
					percent_in_roi: initialValidation.percent_in_roi,
					average_offset: initialValidation.average_offset,
					validation_points: initialValidation.validation_points,
			  }
			: null,
		final_validation: finalValidation
			? {
					percent_in_roi: finalValidation.percent_in_roi,
					average_offset: finalValidation.average_offset,
			  }
			: null,
	};

	// 2. Process Experiment Trials
	// Filter for trials that have a screenId (the actual experiment screens)
	const experimentTrials = rawData.filter((t: JsPsychTrial) => t.screenId !== undefined).values();

	const participantTrials = rawData
		.filter(
			(t: JsPsychTrial) => t.participantName !== undefined || t.participantEmail !== undefined
		)
		.values();

	const participantInfo = participantTrials.length
		? {
				name: participantTrials[0].participantName ?? null,
				email: participantTrials[0].participantEmail ?? null,
		  }
		: { name: null, email: null };

	const formattedTrials = experimentTrials.map((trial: JsPsychTrial) => {
		const targets: ProcessedTarget[] = [];

		// Calculate AOI hits if webgazer data exists
		if (trial.webgazer_targets && trial.webgazer_data) {
			const targetSelectors = Object.keys(trial.webgazer_targets);

			targetSelectors.forEach((selector) => {
				const box = trial.webgazer_targets![selector];
				const gazePoints = trial.webgazer_data!;

				let hits = 0;
				gazePoints.forEach((point: GazePoint) => {
					if (
						point.x >= box.left &&
						point.x <= box.right &&
						point.y >= box.top &&
						point.y <= box.bottom
					) {
						hits++;
					}
				});

				const percentage = gazePoints.length > 0 ? (hits / gazePoints.length) * 100 : 0;

				targets.push({
					selector: selector,
					bounding_box: box,
					fixation_percentage: parseFloat(percentage.toFixed(2)),
					hit_count: hits,
					total_gaze_points: gazePoints.length,
				});
			});
		}

		return {
			trial_index: trial.trial_index,
			screen_id: trial.screenId,
			audio_id: trial.audioId || null,
			type: trial.trial_type,
			stimulus: trial.stimulus,
			rt: trial.rt,
			response: trial.response,
			targets: targets,
			gaze_data: trial.webgazer_data, // Raw X/Y/Time data
		};
	});

	// 3. Construct Final JSON
	return {
		experiment_id: experimentId,
		participant: participantInfo,
		timestamp: new Date().toISOString(),
		browser_info: {
			userAgent: navigator.userAgent,
			window_width: window.innerWidth,
			window_height: window.innerHeight,
		},
		calibration_data: calibrationData,
		trials: formattedTrials,
	};
};

export const downloadJson = (data: any, filename: string) => {
	const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};
