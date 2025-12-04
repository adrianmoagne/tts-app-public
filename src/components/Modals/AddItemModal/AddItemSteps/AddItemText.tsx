import { Box, Typography, Badge } from "@leux/ui";
import S from "../AddItemModal.styles";
import type { ItemPosition } from "@/@types";
import { addItemActions, type StoreState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

const AddItemText: React.FC = () => {
	const dispatch = useDispatch();
	const { position } = useSelector((state: StoreState) => state.addItem);
	const positionsItems: ItemPosition[] = ["UL", "UC", "UR", "CL", "C", "CR", "BL", "BC", "BR"];
	// const alignmentsItems: ItemAlignment[] = [
	// 	"top-left",
	// 	"top-center",
	// 	"top-right",
	// 	"center-left",
	// 	"center-center",
	// 	"center-right",
	// 	"bottom-left",
	// 	"bottom-center",
	// 	"bottom-right",
	// ];

	const handlePostionSelect = (pos: ItemPosition) => {
		dispatch(addItemActions.setPosition(pos));
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
							$selected={position === pos}
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
