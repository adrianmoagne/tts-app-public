import { Table, Input } from "@leux/ui";
import type { IScreen, TemplateType } from "@/@types";
import S from "./DynamicTable.styles";
import { useMemo } from "react";
import { ArrowUp, ArrowDown } from "react-feather";

type BoardScreen = {
	id: string;
	name: string;
	elements: number | null;
	displays?: IScreen | null;
};

type Props = {
	boardScreens: BoardScreen[];
	onReorderScreens?: (ordered: BoardScreen[]) => void;
	onUpdateScreenItem?: (boardScreenId: string, itemId: string, value: string) => void;
	screenValues?: Record<string, Record<string, string>>; // boardScreenId -> itemId -> value
	collapseBorder?: boolean;
};

const DynamicTable: React.FC<Props> = ({
	boardScreens,
	onReorderScreens,
	onUpdateScreenItem,
	screenValues = {},
	collapseBorder = false,
}) => {
	const columns = useMemo(() => {
		const seenTemplates = new Set<string>();
		const allColumns: Array<{
			key: string;
			type: TemplateType;
			label: string;
			displaysId: string;
			itemId: string;
		}> = [];
		const typeCounters: Record<TemplateType, number> = {
			image: 0,
			audio: 0,
			text: 0,
		};

		boardScreens.forEach((boardScreen) => {
			if (!boardScreen.displays) return;

			// Only process each unique template structure once for columns
			if (seenTemplates.has(boardScreen.displays._id)) {
				return;
			}
			seenTemplates.add(boardScreen.displays._id);

			boardScreen.displays.items.forEach((item) => {
				if (!item.template_type) return;

				typeCounters[item.template_type] += 1;
				allColumns.push({
					key: `${boardScreen.displays!._id}_${item._id}`,
					type: item.template_type,
					label: `${item.template_type} ${typeCounters[item.template_type]}`,
					displaysId: boardScreen.displays!._id,
					itemId: item._id,
				});
			});
		});

		return allColumns;
	}, [boardScreens]);

	const moveBoardScreen = (index: number, delta: number) => {
		if (!onReorderScreens) return;
		const target = index + delta;
		if (target < 0 || target >= boardScreens.length) return;
		const next = [...boardScreens];
		[next[index], next[target]] = [next[target], next[index]];
		onReorderScreens(next);
	};

	const collapsedBorderStyles: React.CSSProperties = collapseBorder
		? {
			borderRadius: 0,
			border: "none",
		}
		: {};

	return (
		<S.Container>
			<Table.Root variant="bordered" height="auto" customWrapperStyles={collapsedBorderStyles}>
				<Table.Header>
					<Table.HeaderRow>
						<Table.HeaderColumn>Order</Table.HeaderColumn>
						<Table.HeaderColumn>#</Table.HeaderColumn>
						<Table.HeaderColumn>display</Table.HeaderColumn>
						{columns.map((column) => (
							<Table.HeaderColumn key={column.key}>{column.label}</Table.HeaderColumn>
						))}
					</Table.HeaderRow>
				</Table.Header>
				<Table.Body>
					{boardScreens.map((boardScreen, idx) => (
						<Table.BodyRow key={boardScreen.id}>
							<Table.BodyCell>
								<S.Actions>
									<S.ActionIcon disabled={idx === 0}>
										<ArrowUp size={16} onClick={() => moveBoardScreen(idx, -1)} />
									</S.ActionIcon>
									<S.ActionIcon disabled={idx === boardScreens.length - 1}>
										<ArrowDown size={16} onClick={() => moveBoardScreen(idx, 1)} />
									</S.ActionIcon>
								</S.Actions>
							</Table.BodyCell>
							<Table.BodyCell>{idx + 1}</Table.BodyCell>
							<Table.BodyCell>{boardScreen.name}</Table.BodyCell>
							{columns.map((column) => {
								// Find if this boardScreen has an item matching this column's itemId
								const matchingItem = boardScreen.displays?.items.find(
									item => item._id === column.itemId
								);

								const defaultValue = screenValues[boardScreen.id]?.[column.itemId] || "";

								return (
									<Table.BodyCell key={column.key}>
										{matchingItem ? (
											<Input
												variant="filled"
												fieldKey={`${boardScreen.id}_${column.itemId}`}
												inputProps={{
													defaultValue: defaultValue,
													onBlur: (e) => {
														const target = e.target as HTMLInputElement;
														onUpdateScreenItem?.(boardScreen.id, column.itemId, target.value);
													},
												}}
											/>
										) : "---"}
									</Table.BodyCell>
								);
							})}
						</Table.BodyRow>
					))}
				</Table.Body>
			</Table.Root>
		</S.Container>
	);
};

export default DynamicTable;
