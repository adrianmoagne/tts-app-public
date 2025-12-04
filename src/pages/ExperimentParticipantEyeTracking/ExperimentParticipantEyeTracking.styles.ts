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
`;

const WelcomeContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	gap: 16px;
	padding: 24px;
	max-width: 600px;
`;

const RequirementsList = styled.ul`
	text-align: left;
	margin: 16px 0;
	padding-left: 24px;
	
	li {
		margin-bottom: 8px;
	}
`;

const ButtonGroup = styled.div`
	display: flex;
	gap: 12px;
	justify-content: center;
	margin-top: 24px;
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
	WelcomeContainer,
	RequirementsList,
	ButtonGroup,
	CompletionContainer,
};
