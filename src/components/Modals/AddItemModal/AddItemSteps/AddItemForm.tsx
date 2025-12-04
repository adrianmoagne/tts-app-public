import { Box, Typography, Input } from "@leux/ui";
import S from "../AddItemModal.styles";
import type { ItemAlignment, ItemPosition } from "@/@types";
import { addItemActions, type StoreState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "react-feather";

const AddItemForm: React.FC = () => {
	const dispatch = useDispatch();
	const { draft } = useSelector((state: StoreState) => state.addItem);
	const positionsItems: ItemPosition[] = ["UL", "UC", "UR", "CL", "C", "CR", "BL", "BC", "BR"];
	const alignmentsItems: ItemAlignment[] = [
		"top-left",
		"top-center",
		"top-right",
		"center-left",
		"center-center",
		"center-right",
		"bottom-left",
		"bottom-center",
		"bottom-right",
	];

	// Derive the selected position from draft state
	const getSelectedPosition = (): ItemPosition | null => {
		if (!draft.area || !draft.position) return null;
		const areaMap: Record<string, string> = { heading: "U", content: "C", footer: "B" };
		const posMap: Record<string, string> = { left: "L", center: "", right: "R" };
		const prefix = areaMap[draft.area] || "";
		const suffix = posMap[draft.position] || "";
		const result = prefix + (suffix || "C");
		// Handle special case for center content
		if (draft.area === "content" && draft.position === "center") return "C";
		return result as ItemPosition;
	};

	// Derive the selected alignment from draft state
	const getSelectedAlignment = (): ItemAlignment | null => {
		if (!draft.v_align || !draft.h_align) return null;
		return `${draft.v_align}-${draft.h_align}` as ItemAlignment;
	};

	const selectedPosition = getSelectedPosition();
	const selectedAlignment = getSelectedAlignment();

	const handlePostionSelect = (pos: ItemPosition) => {
		dispatch(addItemActions.setDraftFromPosition(pos));
	};

	const handleAlignmentSelect = (align: ItemAlignment) => {
		dispatch(addItemActions.setDraftFromAlignment(align));
	};
	return (
		<>
			<Typography variant="body-2">Select a form</Typography>
			<S.Wrapper>
				<Input placeholder="Search and select..." />
				<S.FloatingIcon>
					<Search size={16} />
				</S.FloatingIcon>
			</S.Wrapper>
			<Typography variant="body-2">Select item position</Typography>
			<Box flex flexDirection="column" flexGap={6}>
				<S.Grid>
					{positionsItems.map((pos) => (
						<S.SelectableButton
							key={pos}
							onClick={() => handlePostionSelect(pos)}
							$selected={selectedPosition === pos}
						>
							{pos}
						</S.SelectableButton>
					))}
				</S.Grid>
			</Box>
			<Box flex flexDirection="column" flexGap={6}>
				<Typography variant="body-2">Select item alignment</Typography>
				<S.Grid>
					{alignmentsItems.map((align) => (
						<S.SelectableButton
							key={align}
							onClick={() => handleAlignmentSelect(align)}
							$selected={selectedAlignment === align}
						></S.SelectableButton>
					))}
				</S.Grid>
			</Box>
		</>
	);
};

export default AddItemForm;
