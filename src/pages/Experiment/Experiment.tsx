import { Typography, Button, Badge, useModal } from "@leux/ui";
import S from "./Experiment.styles";
import { DynamicTable, ExperimentDisplays, Modals } from "@/components";
import { Monitor, GitCommit, Airplay, Mail } from "react-feather";
import { useTheme } from "@emotion/react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { ExperimentService } from "@/api/services";
import { Pages, ModalId, ModalSizes, type IScreen } from "@/@types";
import { useNavigate } from "react-router";


type TabKey = "displays" | "tour";

type BoardScreen = {
	id: string;
	name: string;
	elements: number | null;
	displays?: IScreen | null;
};

const Experiment: React.FC = () => {
	const theme = useTheme();
	const { createModal } = useModal();
	const [activeTab, setActiveTab] = useState<TabKey>("displays");
	const [screens, setScreens] = useState<BoardScreen[]>([]);
	const [experimentName, setExperimentName] = useState<string>("");
	const [experimentType, setExperimentType] = useState<"mos" | "eyetrackingMos">("mos");
	const navigate = useNavigate();
	// Store filled data: screenId -> itemId -> value (media ID or text content)
	const [screenValues, setScreenValues] = useState<Record<string, Record<string, string>>>({});

	// take the project id from the url
	const { id: experimentId } = useParams<{ id: string }>();


	const colorFor = (tab: TabKey) =>
		activeTab === tab ? theme.main.primary : theme.main.placeholder;

	useEffect(() => {
		if (!experimentId) return;

		ExperimentService.fetchExperimentById(experimentId)
			.then((res) => {
				console.log("Full API response:", res);
				console.log("res.data:", res.data);

				// Handle different possible API response structures
				const experimentData = res.data?.data;
				console.log("experimentData:", experimentData);
				console.log("Experiment screens:", experimentData?.screens);

				// Check if screens exists and is an array
				if (experimentData?.screens && Array.isArray(experimentData.screens)) {
					const boardScreens: BoardScreen[] = experimentData.screens.map((screen: IScreen) => ({
						id: screen._id,
						name: screen.alias,
						elements: screen.items.length,
						displays: screen,
					}));
					console.log("Mapped boardScreens:", boardScreens);
					setScreens(boardScreens);
					setExperimentName(experimentData.alias || "Experiment");
					// Set experiment type from API data, default to "mos"
					setExperimentType(experimentData.type || "mos");
				} else {
					console.log("No screens found or not an array:", experimentData);
				}
			})
			.catch((err) => {
				console.error("Error fetching experiment:", err);
			});
	}, [experimentId]);

	const handleAddScreen = () => {
		console.log("Add screen clicked");
		// TODO: Implement add screen logic
	};
	const handleExperimentPreview = () => {
		const previewRoute = experimentType === "eyetrackingMos"
			? Pages.ExperimentPreviewEyeTracking
			: Pages.ExperimentPreviewMos;
		navigate(previewRoute.replace(":id", experimentId || ""));
	}

	const handleInviteParticipants = () => {
		createModal({
			id: ModalId.InviteParticipants,
			title: "Invite Participants",
			children: (
				<Modals.InviteParticipantsModal.Content
					experimentId={experimentId || ""}
					experimentName={experimentName}
				/>
			),
			width: ModalSizes.InviteParticipants,
			footer: null,
		});
	}

	return (
		<S.Container>
			<S.RowBetween>
				<Typography variant="h3" textColor="textOne">
					Experiment
				</Typography>
				<Badge
					size="large"
					variant="outlined"
					clickable
					onClick={handleInviteParticipants}
				>
					<Mail size={16} color={theme.main.primary} />
					&nbsp;
					Invite Participants
				</Badge>
			</S.RowBetween>
			<S.Frame>
				<S.NavBar>
					<S.NavBarItem active={activeTab === "displays"} onClick={() => setActiveTab("displays")}>
						<Monitor size={16} color={colorFor("displays")} fill={
							activeTab === "displays" ?
								theme.main.primaryGhost : theme.main.backgroundOne} />
						<Typography
							variant="caption"
							textColor={activeTab === "displays" ? "primary" : "placeholder"}
						>
							Displays
						</Typography>
					</S.NavBarItem>

					<S.NavBarItem
						active={activeTab === "tour"}
						onClick={() => setActiveTab("tour")}
					>
						<GitCommit size={16} color={colorFor("tour")} />
						<Typography
							variant="caption"
							textColor={activeTab === "tour" ? "primary" : "placeholder"}
						>
							Tour
						</Typography>
					</S.NavBarItem>
				</S.NavBar>
				<S.NavBarContent>
					{activeTab === "displays" && (
						<>	<S.NavBarHeader>
							<div></div>
							<Badge size="large" variant="outlined" clickable
								onClick={handleExperimentPreview}

							>
								<Airplay size={16} color={theme.main.success} fill={theme.main.successGhost} />
								&nbsp;
								Run Preview

							</Badge>
						</S.NavBarHeader>

							<ExperimentDisplays screens={screens} onAddScreen={handleAddScreen} />
						</>
					)}
					{activeTab === "tour" && (
						<>
							<S.NavBarHeader>
								<div></div>
								<Button
									customStyles={{
										width: "100px",
									}}
								>
									Upload
								</Button>
							</S.NavBarHeader>

							<DynamicTable
								collapseBorder
								boardScreens={screens.filter(
									(s) => s.displays !== null && s.displays !== undefined
								)}
								screenValues={screenValues}
								onUpdateScreenItem={(boardScreenId, itemId, value) => {
									setScreenValues((prev) => ({
										...prev,
										[boardScreenId]: {
											...prev[boardScreenId],
											[itemId]: value,
										},
									}));
								}}
								onReorderScreens={(ordered) => {
									setScreens(ordered);
								}}
							/>
						</>
					)}
				</S.NavBarContent>
			</S.Frame>
		</S.Container>
	);
};

export default Experiment;
