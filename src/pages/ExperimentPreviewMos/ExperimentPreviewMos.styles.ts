import styled from "@emotion/styled";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100vw;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	margin: 0;
	padding: 0;

	/* Force jsPsych content to fill the container */
	.jspsych-content-wrapper {
		width: 100% !important;
		height: 100% !important;
		padding: 0 !important;
		margin: 0 !important;
		display: flex !important;
		flex-direction: column !important;
		justify-content: center !important;
	}

	.jspsych-content {
		width: 100% !important;
		height: 100% !important;
		max-width: none !important;
		margin: 0 !important;
		padding: 0 !important;
		display: flex !important;
		flex-direction: column !important;
	}

	/* The specific stimulus container from the plugin */
	#jspsych-html-keyboard-response-stimulus {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	#jspsych-html-button-response-btngroup {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		margin: 20px auto;
		width: fit-content;
	}
	.jspsych-html-button-response-button {
		display: block !important;
		margin: 0 !important;
		width: 100%;
		text-align: left;
	}

	/* Container for the question (audio + options) */
	.jspsych-survey-multi-choice-question {
		width: 340px !important;
		margin: 0 auto !important;
		display: flex !important;
		flex-direction: column !important;
		align-items: stretch !important;
		gap: 12px !important;
	}

	/* The prompt containing the audio player */
	.jspsych-survey-multi-choice-text {
		width: 100% !important;
		display: block !important;
		margin: 0 !important;
		padding: 0 !important;
	}

	/* Individual option rows */
	.jspsych-survey-multi-choice-option {
		width: 100% !important;
		margin: 0 auto !important;
		display: flex !important;
		align-items: center !important;
		gap: 10px !important;
		padding: 6px 0 !important;
		font-size: 16px !important;
		line-height: 1.4 !important;
	}

	.jspsych-survey-multi-choice-option input[type="radio"] {
		width: 18px !important;
		height: 18px !important;
		margin: 0 !important;
	}

	.mos-card {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 16px;
		width: 100%;
	}

	.mos-audio-row {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.mos-audio-row audio {
		width: 100%;
	}

	.mos-scale-copy {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.mos-scale-title {
		font-weight: 600;
		font-size: 15px;
	}

	.mos-scale-legend {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 14px;
		color: #4c4c4c;
	}

	.mos-scale-legend li {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.mos-scale-legend li span {
		font-weight: 700;
		min-width: 16px;
	}

	/* Center the submit button */
	.jspsych-btn {
		display: block;
		margin: 30px auto 0 auto;
	}
`;

const PreviewBanner = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
	color: white;
	padding: 8px 16px;
	text-align: center;
	font-weight: 600;
	font-size: 14px;
	z-index: 10000;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
`;

const CompletionContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	gap: 16px;
	padding: 24px;
`;

export default {
	Container,
	PreviewBanner,
	CompletionContainer,
};
