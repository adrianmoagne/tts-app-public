import { useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { Button, Typography } from "@leux/ui";
import { useJsPsychEyeTrackingExperiment } from "@/hooks";
import S from "./ExperimentParticipantEyeTracking.styles";

type Step = "welcome" | "experiment" | "completed";

const ExperimentParticipantEyeTracking = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const experimentId = params.id as string;
  const participantToken = searchParams.get("token") || undefined;

  const [step, setStep] = useState<Step>("welcome");

  const {
    containerRef,
    isLoading,
    isFinished,
    error,
    startExperiment,
  } = useJsPsychEyeTrackingExperiment({
    experimentId,
    participantToken,
    isPreview: false,
    skipParticipantForm: false, // Will show jsPsych's built-in form
    onFinish: (results) => {
      console.log("Experiment completed:", results);
      setStep("completed");
    },
  });

  const handleStartExperiment = () => {
    setStep("experiment");
    startExperiment();
  };

  if (error) {
    return (
      <S.Container>
        <S.CompletionContainer>
          <Typography variant="h3" textColor="danger">
            Error
          </Typography>
          <Typography>{error}</Typography>
          <Typography variant="caption">
            Please contact the researcher if this problem persists.
          </Typography>
        </S.CompletionContainer>
      </S.Container>
    );
  }

  if (step === "welcome") {
    return (
      <S.Container>
        <S.WelcomeContainer>
          <Typography variant="h2">Welcome to the Eye Tracking Experiment</Typography>
          <Typography>
            Thank you for participating in this study. Before we begin, please ensure you meet the following requirements:
          </Typography>
          <S.RequirementsList>
            <li>You have a working webcam</li>
            <li>You are in a well-lit environment</li>
            <li>Your face is clearly visible to the camera</li>
            <li>You can sit still during the calibration process</li>
          </S.RequirementsList>
          <Typography variant="caption">
            The experiment will start with a camera calibration process. Please follow the on-screen instructions carefully.
          </Typography>
          <S.ButtonGroup>
            <Button
              colorScheme="primary"
              onClick={handleStartExperiment}
              state={{ disabled: isLoading }}
            >
              {isLoading ? "Loading..." : "I'm Ready - Start Experiment"}
            </Button>
          </S.ButtonGroup>
        </S.WelcomeContainer>
      </S.Container>
    );
  }

  if (step === "completed" || isFinished) {
    return (
      <S.Container>
        <S.CompletionContainer>
          <Typography variant="h2">Thank You!</Typography>
          <Typography>
            The experiment is now complete. Your responses have been recorded.
          </Typography>
          <Typography variant="caption">
            You may now close this window.
          </Typography>
        </S.CompletionContainer>
      </S.Container>
    );
  }

  // Experiment running
  return (
    <S.Container>
      <div ref={containerRef} />
    </S.Container>
  );
};

export default ExperimentParticipantEyeTracking;
