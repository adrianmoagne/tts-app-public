import { Typography } from "@leux/ui";
import S from "./ExperimentDisplays.styles";
import type { IScreen } from "@/@types";

import { DisplayBuilder, TemplateCard } from "@/components";
import { useState } from "react";

type BoardScreen = {
	id: string;
	name: string;
	elements: number | null;
	displays?: IScreen | null;
};

interface ExperimentDisplaysProps {
	screens: BoardScreen[];
	onAddScreen?: () => void;
	onBack?: () => void;

}


const ExperimentDisplays: React.FC<ExperimentDisplaysProps> = ({
	screens,
	onAddScreen,
	onBack,

}) => {
	const [mode, setMode] = useState<"view" | "create">("view");
	const [selectedScreen, setSelectedScreen] = useState<BoardScreen | null>(null);
	// const theme = useTheme();
	if (mode === "create") {
		return (
			<DisplayBuilder boardScreen={selectedScreen} onSave={() => { setMode("view"); onBack!(); }} />
		)
	}

	return (
		<>

			<S.Board>
				{screens.map((s) => (
					console.log("teste", s),
					<S.ScreenCard key={s.id}>
						{s.displays && <TemplateCard screen={s.displays} onClick={() => {
							if (s.displays?.items?.length === 0) {
								setSelectedScreen(s);
								setMode("create");
								onAddScreen!();

							}
						}} />}
						<Typography variant="body-1" textColor="textOne">
							{s.name}
						</Typography>
					</S.ScreenCard>
				))}
			</S.Board></>
	)



}

export default ExperimentDisplays;


