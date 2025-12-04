import { useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { Button, Input, Typography } from "@leux/ui";
import { useJsPsychMosExperiment } from "@/hooks";
import S from "./ExperimentParticipantMos.styles";

type Step = "welcome" | "form" | "experiment" | "completed";

const ExperimentParticipantMos = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const experimentId = params.id as string;
  const participantToken = searchParams.get("token") || undefined;

  const [step, setStep] = useState<Step>("welcome");
  const [participant, setParticipant] = useState({
    name: "",
    email: "",
  });

  const {
    containerRef,
    isLoading,
    isFinished,
    error,
    screens,
    startExperiment,
  } = useJsPsychMosExperiment({
    experimentId,
    participantToken,
    participant,
    isPreview: false,
    onFinish: (results) => {
      console.log("Experiment completed:", results);
      setStep("completed");
    },
  });

  const canProceedFromForm =
    participant.name.trim().length > 0 && participant.email.trim().length > 0;

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
          <Typography variant="h2">Welcome to the Experiment</Typography>
          <Typography>
            Thank you for participating in this study. Please click Next to continue.
          </Typography>
          <S.ButtonGroup>
            <Button colorScheme="primary" onClick={() => setStep("form")}>
              Next
            </Button>
          </S.ButtonGroup>
        </S.WelcomeContainer>
      </S.Container>
    );
  }

  if (step === "form") {
    return (
      <S.Container>
        <S.FormContainer>
          <h3 style={{ marginBottom: "24px", textAlign: "center" }}>
            Participant Information
          </h3>
          <S.FormField>
            <Typography>Full Name</Typography>
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setParticipant((p) => ({ ...p, name: e.target.value }))
              }
            />
          </S.FormField>
          <S.FormField>
            <Typography>Email Address</Typography>
            <Input
              type="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setParticipant((p) => ({ ...p, email: e.target.value }))
              }
            />
          </S.FormField>
          <S.ButtonGroup>
            <Button colorScheme="secondary" onClick={() => setStep("welcome")}>
              Back
            </Button>
            <Button
              colorScheme="primary"
              onClick={handleStartExperiment}
              state={{ disabled: !canProceedFromForm || isLoading || !screens }}
            >
              {isLoading ? "Loading..." : "Start Experiment"}
            </Button>
          </S.ButtonGroup>
        </S.FormContainer>
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

export default ExperimentParticipantMos;
