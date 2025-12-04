import { useState } from "react";
import S from "./InviteParticipantsModal.styles";
import { Button, Input, Typography } from "@leux/ui";
import { ExperimentService } from "@/api/services";

interface InviteParticipantsModalProps {
  experimentId: string;
  experimentName: string;
  onClose?: () => void;
}

const Content: React.FC<InviteParticipantsModalProps> = ({
  experimentId,
  experimentName,
  onClose,
}) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    sent: string[];
    failed: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddEmail = () => {
    const email = inputValue.trim().toLowerCase();
    if (email && isValidEmail(email) && !emails.includes(email)) {
      setEmails([...emails, email]);
      setInputValue("");
      setError(null);
    } else if (email && !isValidEmail(email)) {
      setError("Please enter a valid email address");
    } else if (emails.includes(email)) {
      setError("This email is already in the list");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((e) => e !== emailToRemove));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const pastedEmails = pastedText
      .split(/[\s,;]+/)
      .map((email) => email.trim().toLowerCase())
      .filter((email) => isValidEmail(email) && !emails.includes(email));

    if (pastedEmails.length > 0) {
      setEmails([...emails, ...pastedEmails]);
      setInputValue("");
    }
  };

  const handleSend = async () => {
    if (emails.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      const response = await ExperimentService.sendInvitations(
        experimentId,
        emails
      );
      setResult(response.data);
      if (response.data.failed.length === 0) {
        setEmails([]);
      } else {
        // Keep only failed emails for retry
        setEmails(response.data.failed);
      }
    } catch (err) {
      console.error("Failed to send invitations:", err);
      setError("Failed to send invitations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Container>
      <Typography variant="body-2">
        Invite participants to "{experimentName}"
      </Typography>

      <S.InputWrapper>
        <Typography variant="caption">
          Enter email addresses (press Enter to add, or paste multiple emails)
        </Typography>
        <S.EmailInput>
          <Input
            placeholder="participant@email.com"
            inputProps={{
              value: inputValue,
              onChange: (e) => setInputValue(e.target.value),
              onKeyDown: handleKeyDown,
              onPaste: handlePaste,
            }}
            customStyles={{ flex: 1 }}
          />
          <Button
            colorScheme="secondary"
            onClick={handleAddEmail}
            state={{ disabled: !inputValue.trim() }}
          >
            Add
          </Button>
        </S.EmailInput>
        {error && (
          <Typography variant="caption" customStyles={{ color: "red" }}>
            {error}
          </Typography>
        )}
      </S.InputWrapper>

      <div>
        <Typography variant="caption">
          Participants to invite ({emails.length})
        </Typography>
        <S.ChipsContainer>
          {emails.length === 0 ? (
            <Typography
              variant="caption"
              customStyles={{ color: "#888", width: "100%", textAlign: "center" }}
            >
              No emails added yet
            </Typography>
          ) : (
            emails.map((email) => (
              <S.Chip key={email}>
                {email}
                <S.ChipRemove onClick={() => handleRemoveEmail(email)}>
                  ×
                </S.ChipRemove>
              </S.Chip>
            ))
          )}
        </S.ChipsContainer>
      </div>

      {result && (
        <S.ResultMessage
          variant={result.failed.length > 0 ? "warning" : "success"}
        >
          {result.sent.length > 0 && (
            <>✓ {result.sent.length} invitation(s) sent successfully.</>
          )}
          {result.failed.length > 0 && (
            <>
              {" "}
              ⚠ {result.failed.length} failed to send.
            </>
          )}
        </S.ResultMessage>
      )}

      <S.FooterRow>
        {onClose && (
          <Button colorScheme="secondary" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button
          colorScheme="primary"
          onClick={handleSend}
          state={{ disabled: emails.length === 0 || loading }}
        >
          {loading
            ? "Sending..."
            : `Send ${emails.length} Invitation${emails.length !== 1 ? "s" : ""}`}
        </Button>
      </S.FooterRow>
    </S.Container>
  );
};

const InviteParticipantsModal = {
  Content,
};

export default InviteParticipantsModal;
