import {
	ModalId,
	audioMockScreenTemplate,
	blankScreenTemplate,
	twoImagesScreenTemplate,
	type IScreen,
} from "@/@types";
import { setupNewScreenActions, templateViewerActions, type StoreState } from "@/store";
import { Button, Typography, useModal } from "@leux/ui";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import S from "./SetupNewScreenModal.styles";

type Props = {
	onCreate?: (payload: { type: "blank" | "template"; template?: IScreen | null }) => void;
	modalId?: string;
};

const Content: React.FC<Props> = ({ onCreate, modalId }) => {
	const { closeModal } = useModal();

	const dispatch = useDispatch();
	const { selectedType, selectedTemplate } = useSelector(
		(state: StoreState) => state.setupNewScreen
	);

	useEffect(() => {
		// Ensure clean state on open
		dispatch(setupNewScreenActions.reset());
		dispatch(
			templateViewerActions.setTemplates([
				audioMockScreenTemplate,
				twoImagesScreenTemplate,
				blankScreenTemplate,
			])
		);
	}, [dispatch]);
	// Pull available templates from TemplateViewer slice for now
	const availableTemplates: IScreen[] = useSelector(
		(state: StoreState) => state.templateViewer.templates
	);
	const hasSelection =
		selectedType === "blank" || (selectedType === "template" && !!selectedTemplate);

	const handleCreate = () => {
		if (!hasSelection) {
			return;
		}
		onCreate?.({
			type: selectedType === "blank" ? "blank" : "template",
			template: selectedTemplate,
		});
		dispatch(setupNewScreenActions.reset());
		closeModal(modalId ?? ModalId.SetupNewScreen);
	};

	return (
		<S.Container>
			<S.Options>
				{availableTemplates.map((tpl) => (
					<S.OptionCard
						key={tpl._id}
						$selected={selectedType === "template" && selectedTemplate?._id === tpl._id}
						onClick={() => {
							dispatch(setupNewScreenActions.setSelectedTemplate(tpl));
						}}
					>
						<Typography textColor="textOne">{tpl.alias ?? "Template"}</Typography>
						<Typography variant="caption" textColor="placeholder">
							{tpl.description}
						</Typography>
					</S.OptionCard>
				))}
			</S.Options>

			<S.FooterRow>
				<Button
					colorScheme="primary"
					onClick={handleCreate}
					state={{ disabled: !hasSelection }}
					customStyles={{ width: "100%" }}
				>
					Create Screen
				</Button>
			</S.FooterRow>
		</S.Container>
	);
};

const SetupNewScreenModal = {
	Content,
};
export default SetupNewScreenModal;
