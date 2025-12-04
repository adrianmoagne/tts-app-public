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
		align-items: center !important;
	}

	.jspsych-content {
		width: 100% !important;
		max-width: none !important;
		margin: 0 !important;
		padding: 0 !important;
	}

	/* Ensure experiment content doesn't show behind banner */
	#jspsych-html-keyboard-response-stimulus {
		margin-top: 50px;
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
