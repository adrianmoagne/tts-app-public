import { Typography, useModal, Button } from "@leux/ui";
import S from "./ExperimentCreate.styles";
import { DynamicTable, Modals, ExperimentDisplays } from "@/components";
import { Download, Monitor, PlusCircle, Table, Upload } from "react-feather";
import { useTheme } from "@emotion/react";
import { useRef, useState } from "react";
import { ModalId, ModalSizes, Pages, type IScreen } from "@/@types";
import { useNavigate, useParams } from "react-router";
import { ExperimentService } from "@/api/services";
import Papa from "papaparse";


type TabKey = "displays" | "spreadsheet" | "view";

type BoardScreen = {
	id: string;
	name: string;
	elements: number | null;
	displays?: IScreen | null;
};

const ExperimentCreate: React.FC = () => {
	const theme = useTheme();
	const { createModal } = useModal();
	const [activeTab, setActiveTab] = useState<TabKey>("displays");
	const [screens, setScreens] = useState<BoardScreen[]>([]);
	// const [experimentName, setExperimentName] = useState("");
	const [experimentDescription, setExperimentDescription] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	// Store filled data: screenId -> itemId -> value (media ID or text content)
	const [screenValues, setScreenValues] = useState<Record<string, Record<string, string>>>({});

	const fileInputRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();
	// take the project id from the url
	const { id: projectId } = useParams<{ id: string }>();

	const handleCreateExperiment = async () => {
		if (screens.length === 0) {
			return;
		}
		// setExperimentName("Teste");
		setExperimentDescription("");
		setIsSubmitting(true);

		try {
			const payload = {
				alias: "Just a test",
				description: experimentDescription.trim() || undefined,
				status: "draft" as const,
				project_id: projectId,
				screens: screens.map((boardScreen) => {
					const boardScreenId = boardScreen.id;
					const filledValues = boardScreenId ? screenValues[boardScreenId] : {};
					console.log(boardScreen)
					return {
						alias: boardScreen.name,
						grid: boardScreen.displays?.grid || {
							type: "3x3" as const,
							subtype: "equal" as const,
						},
						items:
							boardScreen.displays?.items.map((item) => ({
								type: item.type,
								template_type: item.template_type,
								position: item.position,
								area: item.area,
								v_align: item.v_align,
								h_align: item.h_align,
								// If there's a filled value for this item, add it as media
								media: filledValues?.[item._id] || item.media,
							})) || [],
					};
				}),
			};

			console.log("Creating experiment with payload:", payload);

			await ExperimentService.createExperiment(payload);

			if (projectId) {
				navigate(Pages.ProjectDetail.replace(":id", projectId));
			} else {
				navigate(Pages.Projects);
			}
		} catch (err) {
			console.error("Failed to create experiment:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Get the template screen (first screen) to use as reference for columns
	const templateScreen = screens.find((s) => s.displays !== null && s.displays !== undefined);

	// Generate column name from item properties - pattern: "{template_type}_{area}_{position}"
	// e.g., "image_content_left", "audio_heading_center"
	const getColumnName = (item: { template_type?: string; area: string; position: string }) => {
		return `${item.template_type}_${item.area}_${item.position}`;
	};

	const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file || !templateScreen?.displays) return;

		Papa.parse<Record<string, string>>(file, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				const { data } = results;

				if (data.length === 0) {
					console.warn("CSV file is empty");
					return;
				}

				const updatedScreenValues: Record<string, Record<string, string>> = { ...screenValues };
				const updatedScreens: BoardScreen[] = [...screens];
				const processedScreenIds = new Set<string>();

				// Process each CSV row - match by screen name
				data.forEach((row) => {
					const screenName = row["screen_name"];
					if (!screenName) return;

					// Find existing screen with matching name that hasn't been processed yet
					const existingScreenIndex = updatedScreens.findIndex(
						(s) => s.name === screenName && !processedScreenIds.has(s.id)
					);

					if (existingScreenIndex !== -1) {
						// Update existing screen with matching name
						const existingScreen = updatedScreens[existingScreenIndex];
						processedScreenIds.add(existingScreen.id);

						// Update values for this screen
						if (existingScreen.displays?.items) {
							updatedScreenValues[existingScreen.id] = {
								...updatedScreenValues[existingScreen.id],
							};

							existingScreen.displays.items.forEach((item) => {
								const columnName = getColumnName(item);
								const value = row[columnName];

								if (value !== undefined && value !== "") {
									updatedScreenValues[existingScreen.id][item._id] = value;
								}
							});
						}
					} else {
						// Create new screen if no matching name found
						// Use the template from an existing screen with the same name, or fall back to templateScreen
						const sameNameScreen = screens.find((s) => s.name === screenName && s.displays);
						const templateToUse = sameNameScreen?.displays || templateScreen.displays;

						if (templateToUse) {
							const screenId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
							const newScreen: BoardScreen = {
								id: screenId,
								name: screenName,
								elements: templateToUse.items.length ?? 0,
								displays: {
									...templateToUse,
									items: templateToUse.items.map((item) => ({ ...item })),
								},
							};
							updatedScreens.push(newScreen);
							processedScreenIds.add(screenId);

							// Map CSV columns to item values for new screen
							updatedScreenValues[screenId] = {};
							templateToUse.items.forEach((item) => {
								const columnName = getColumnName(item);
								const value = row[columnName];

								if (value !== undefined && value !== "") {
									updatedScreenValues[screenId][item._id] = value;
								}
							});
						}
					}
				});

				setScreens(updatedScreens);
				setScreenValues(updatedScreenValues);

				console.log("CSV imported - Total screens:", updatedScreens.length, "Processed:", processedScreenIds.size);
			},
			error: (error) => {
				console.error("Error parsing CSV:", error);
			},
		});

		// Reset input so same file can be uploaded again
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const downloadCsvTemplate = () => {
		if (!templateScreen?.displays?.items) {
			console.warn("No template screen available to generate CSV template");
			return;
		}

		// Generate headers based on template screen items
		const headers = ["screen_name"];
		templateScreen.displays.items.forEach((item) => {
			headers.push(getColumnName(item));
		});

		// Create example row
		const exampleRow: Record<string, string> = {
			screen_name: "Example Screen 1",
		};
		templateScreen.displays.items.forEach((item) => {
			const colName = getColumnName(item);
			exampleRow[colName] = `value_for_${item.template_type || item.type}`;
		});

		const csvContent = Papa.unparse({
			fields: headers,
			data: [exampleRow],
		});

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", "experiment_template.csv");
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const colorFor = (tab: TabKey) =>
		activeTab === tab ? theme.main.primary : theme.main.placeholder;

	const openTemplateGalleryModal = () => {
		createModal({
			id: ModalId.TemplateGallery,
			title: "Screen Template",
			children: (
				<Modals.SetupNewScreenModal.Content
					key={Date.now()}
					modalId={ModalId.TemplateGallery}
					onCreate={({ type, template }) => {
						setScreens((prev) => {
							// const index = prev.length + 1;
							const next: BoardScreen = {
								id: `${Date.now()}`,
								name: `${type === "blank" ? "Blank Screen" : "Template Screen"}`,
								elements: template?.items.length ?? 0,
								displays: template ?? null,
							};
							return [...prev, next];
						});
					}}
				/>
			),
			width: ModalSizes.SetupNewScreen,
			footer: null,
		});
	};

	return (
		<S.Container>
			<S.RowBetween>
				<Typography variant="h3" textColor="textOne">
					Experiment
				</Typography>
				<Button
					colorScheme="primary"
					onClick={handleCreateExperiment}
					state={{
						disabled: screens.length === 0,
					}}
					size="medium"
					customStyles={{
						width: "200px",
					}}
				>
					{isSubmitting ? "Creating..." : "Create Experiment"}
				</Button>
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
						active={activeTab === "spreadsheet"}
						onClick={() => setActiveTab("spreadsheet")}
					>
						<Table size={16} color={colorFor("spreadsheet")} />
						<Typography
							variant="caption"
							textColor={activeTab === "spreadsheet" ? "primary" : "placeholder"}
						>
							Spreadsheet
						</Typography>
					</S.NavBarItem>
				</S.NavBar>
				<S.NavBarContent>
					{activeTab === "displays" && (
						<>	<S.NavBarHeader>
							<div></div>
							<S.NavBarHeaderActions>
								<S.CreateScreenButton onClick={openTemplateGalleryModal}>
									<PlusCircle size={16} color={theme.main.primary} />
									<span>Add screen</span>
								</S.CreateScreenButton>
							</S.NavBarHeaderActions>
						</S.NavBarHeader>


						</>
					)}
					{(activeTab === "displays" || activeTab === "view") && (
						<ExperimentDisplays screens={screens} onAddScreen={
							() => setActiveTab("view")
						}
							onBack={() => setActiveTab("displays")}
						/>
					)}
					{activeTab === "spreadsheet" && (
						<>
							<S.NavBarHeader>
								<div></div>
								<S.NavBarHeaderActions>
									<Button
										variant="ghost"
										colorScheme="primary"
										onClick={downloadCsvTemplate}
										state={{
											disabled: !templateScreen,
										}}
										customStyles={{
											width: "auto",
											paddingLeft: "12px",
											paddingRight: "12px",
										}}
									>
										<Download size={14} style={{ marginRight: 6 }} />
										Download Template
									</Button>
									<input
										type="file"
										ref={fileInputRef}
										onChange={handleCsvUpload}
										accept=".csv"
										style={{ display: "none" }}
									/>
									<Button
										onClick={handleUploadClick}
										state={{
											disabled: !templateScreen,
										}}
										customStyles={{
											width: "100px",
										}}
									>
										<Upload size={14} style={{ marginRight: 6 }} />
										Upload
									</Button>
								</S.NavBarHeaderActions>
							</S.NavBarHeader>							<DynamicTable
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

export default ExperimentCreate;