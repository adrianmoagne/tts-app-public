import { useParams, useNavigate } from "react-router";
import { Button, Typography } from "@leux/ui";
import { AlertTriangle } from "react-feather";
import { useJsPsychEyeTrackingExperiment } from "@/hooks";
import { Pages } from "@/@types";
import S from "./ExperimentPreviewEyeTracking.styles";

const ExperimentPreviewEyeTracking = () => {
  const params = useParams();
  const navigate = useNavigate();
  const experimentId = params.id as string;

  const {
    containerRef,
    isLoading,
    isFinished,
    error,
    startExperiment,
  } = useJsPsychEyeTrackingExperiment({
    experimentId,
    isPreview: true,
    skipParticipantForm: true,
    onFinish: (results) => {
      console.log("Preview completed (data not saved):", results);
    },
  });

  const handleBackToExperiment = () => {
    navigate(Pages.Experiment.replace(":id", experimentId));
  };

  const handleStartPreview = () => {
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
          <Button colorScheme="primary" onClick={handleBackToExperiment}>
            Go back to experiment
          </Button>
        </S.CompletionContainer>
      </S.Container>
    );
  }

  if (isFinished) {
    return (
      <S.Container>
        <S.PreviewBanner>
          <AlertTriangle size={16} />
          Preview Mode - Data was not saved
        </S.PreviewBanner>
        <S.CompletionContainer>
          <Typography variant="h3">Preview Complete</Typography>
          <Typography>
            This was a preview run. No data has been saved.
          </Typography>
          <Button colorScheme="primary" onClick={handleBackToExperiment}>
            Return to Experiment
          </Button>
        </S.CompletionContainer>
      </S.Container>
    );
  }

  // Show start button for eye tracking to give user control
  if (!isLoading && !containerRef.current?.innerHTML) {
    return (
      <S.Container>
        <S.PreviewBanner>
          <AlertTriangle size={16} />
          Preview Mode - Data will not be saved
        </S.PreviewBanner>
        <S.CompletionContainer>
          <Typography variant="h3">Eye Tracking Preview</Typography>
          <Typography>
            This will run through the full experiment including camera calibration.
          </Typography>
          <Typography variant="caption">
            Make sure your webcam is available and you're in a well-lit environment.
          </Typography>
          <Button colorScheme="primary" onClick={handleStartPreview}>
            Start Preview
          </Button>
        </S.CompletionContainer>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.PreviewBanner>
        <AlertTriangle size={16} />
        Preview Mode - Data will not be saved
      </S.PreviewBanner>
      {isLoading && (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Typography>Loading experiment...</Typography>
        </div>
      )}
      <div ref={containerRef} />
    </S.Container>
  );
};

export default ExperimentPreviewEyeTracking;
