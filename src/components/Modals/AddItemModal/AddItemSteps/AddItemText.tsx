import { Box, Typography, Badge } from "@leux/ui";
import S from "../AddItemModal.styles";
import type { ItemPosition } from "@/@types";
import { addItemActions, type StoreState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

const AddItemText: React.FC = () => {
	const dispatch = useDispatch();
	const { draft } = useSelector((state: StoreState) => state.addItem);
	const positionsItems: ItemPosition[] = ["UL", "UC", "UR", "CL", "C", "CR", "BL", "BC", "BR"];

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

	const selectedPosition = getSelectedPosition();

	const handlePostionSelect = (pos: ItemPosition) => {
		dispatch(addItemActions.setDraftFromPosition(pos));
	};

	// const handleAlignmentSelect = (align: ItemAlignment) => {
	// 	dispatch(addItemActions.setAlignment(align));
	// };
	return (
		<>
			<Typography variant="body-2">Selected text type</Typography>
			<S.Row>
				<Badge>String</Badge>
				<Badge>HTML</Badge>
			</S.Row>

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
			<Box
				flex
				flexDirection="column"
				flexGap={2}
				width={"100%"}
				height={"100%"}
				alignItems="flex-start"
			>
				<Typography variant="body-2">Text Editor</Typography>
				<S.TextEditor></S.TextEditor>
			</Box>
		</>
	);
};

export default AddItemText;
