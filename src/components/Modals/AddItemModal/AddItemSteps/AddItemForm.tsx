import { Box, Typography, Input } from "@leux/ui";
import S from "../AddItemModal.styles";
import type { ItemAlignment, ItemPosition } from "@/@types";
import { addItemActions, type StoreState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "react-feather";

const AddItemForm: React.FC = () => {
	const dispatch = useDispatch();
	const { position, alignment } = useSelector((state: StoreState) => state.addItem);
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

	const handlePostionSelect = (pos: ItemPosition) => {
		dispatch(addItemActions.setPosition(pos));
	};

	const handleAlignmentSelect = (align: ItemAlignment) => {
		dispatch(addItemActions.setAlignment(align));
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
							$selected={position === pos}
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
							$selected={alignment === align}
						></S.SelectableButton>
					))}
				</S.Grid>
			</Box>
		</>
	);
};

export default AddItemForm;
