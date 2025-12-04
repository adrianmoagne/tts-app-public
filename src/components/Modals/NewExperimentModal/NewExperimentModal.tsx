import { useState } from "react";
import S from "./NewExperimentModal.styles";
import { Button, Input, TextArea, Typography } from "@leux/ui";
import { Headphones, Eye } from "react-feather";
import type { ExperimentType } from "@/@types";

export interface NewExperimentData {
  name: string;
  description: string;
  type: ExperimentType;
}

interface ContentProps {
  onSubmit: (data: NewExperimentData) => void;
  onCancel?: () => void;
}

const Content: React.FC<ContentProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState("New Experiment");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ExperimentType>("mos");

  const handleCreate = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim(), type });
  };

  return (
    <S.Container>
      <S.FieldGroup>
        <Typography variant="body-2">Name</Typography>
        <Input
          placeholder="Experiment name"
          inputProps={{
            defaultValue: name,
            onChange: (e) => setName(e.target.value)
          }}
        />
      </S.FieldGroup>

      <S.FieldGroup>
        <Typography variant="body-2">Description (optional)</Typography>
        <TextArea
          rows={3}
          placeholder="Describe your experiment..."
          onChange={(e) => setDescription(e.target.value)}
        />
      </S.FieldGroup>

      <S.FieldGroup>
        <Typography variant="body-2">Experiment Type</Typography>
        <S.TypeSelector>
          <S.TypeCard
            selected={type === "mos"}
            onClick={() => setType("mos")}
          >
            <S.TypeIcon selected={type === "mos"}>
              <Headphones size={24} />
            </S.TypeIcon>
            <Typography
              variant="body-1"
              textColor={type === "mos" ? "primary" : "textTwo"}
            >
              MOS
            </Typography>
            <Typography
              variant="caption"
              textColor="placeholder"
              customStyles={{ textAlign: "center" }}
            >
              Audio quality rating
            </Typography>
          </S.TypeCard>

          <S.TypeCard
            selected={type === "eyetrackingMos"}
            onClick={() => setType("eyetrackingMos")}
          >
            <S.TypeIcon selected={type === "eyetrackingMos"}>
              <Eye size={24} />
            </S.TypeIcon>
            <Typography
              variant="body-1"
              textColor={type === "eyetrackingMos" ? "primary" : "textTwo"}
            >
              Eye Tracking
            </Typography>
            <Typography
              variant="caption"
              textColor="placeholder"
              customStyles={{ textAlign: "center" }}
            >
              Audio with visual tracking
            </Typography>
          </S.TypeCard>
        </S.TypeSelector>
      </S.FieldGroup>

      <S.FooterRow>
        {onCancel && (
          <Button
            variant="ghost"
            colorScheme="secondary"
            customStyles={{ width: "100px" }}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          colorScheme="primary"
          customStyles={{ width: "120px" }}
          onClick={handleCreate}
          state={{ disabled: !name.trim() }}
        >
          Create
        </Button>
      </S.FooterRow>
    </S.Container>
  );
};

const NewExperimentModal = {
  Content,
};

export default NewExperimentModal;
