import { Table, Typography, Button, Box, Dropdown, useModal } from "@leux/ui";
import { useEffect } from "react";
import S from "./Projects.styles";
import { useNavigate, useParams } from "react-router";
import type { IExperiment, IProject } from "@/@types";
import { Pages, ModalId, ModalSizes } from "@/@types";
import type { StoreDispatch, StoreState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { projectActions } from "@/store";
import { AlertCircle, Trash2 } from "react-feather";
import { IconButton, Modals } from "@/components";
import { useTheme } from "@emotion/react"

const ProjectDetail: React.FC = () => {
	const params = useParams();
	const navigate = useNavigate();
	const projectId = params.id as string;
	const { projects, loading } = useSelector((state: StoreState) => state.project);
	const project = projects.find((p: IProject) => p._id === projectId);
	const dispatch = useDispatch<StoreDispatch>();
	const theme = useTheme();
	const { createModal, closeModal } = useModal();

	useEffect(() => {
		if (projects.length === 0) {
			dispatch(projectActions.fetchProjects());
		}
	}, [projects.length, dispatch]);

	const openNewExperimentModal = () => {
		createModal({
			id: ModalId.NewExperiment,
			title: "Create New Experiment",
			children: (
				<Modals.NewExperimentModal.Content
					onSubmit={(data) => {
						closeModal(ModalId.NewExperiment);
						// Navigate to experiment create with query params
						const searchParams = new URLSearchParams({
							name: data.name,
							description: data.description,
							type: data.type,
						});
						navigate(`${Pages.ProjectExperimentCreate.replace(":id", project!._id)}?${searchParams.toString()}`);
					}}
					onCancel={() => closeModal(ModalId.NewExperiment)}
				/>
			),
			width: ModalSizes.NewExperiment,
			footer: null,
		});
	};

	if (loading || projects.length === 0) {
		return (
			<S.Container>
				<Typography variant="h3" textColor="textOne">
					Loading…
				</Typography>
			</S.Container>
		);
	}

	if (!project) {
		return (
			<S.Container>
				<Typography variant="h3" textColor="danger">
					Project not found
				</Typography>
			</S.Container>
		);
	}
	return (
		<S.Container>
			<Box flex flexDirection="row" justifyContent="space-between" alignItems="center">
				<Typography variant="h3" textColor="textOne">
					{project.alias}
				</Typography>
				<Button
					colorScheme="primary"
					onClick={openNewExperimentModal}
				>
					New Experiment
				</Button>
			</Box>
			<Typography variant="h6" textColor="textOne">
				{project.description}
			</Typography>

			<Table.Root variant="bordered" height="auto" size="medium">
				<Table.Header>
					<Table.HeaderRow>
						<Table.HeaderColumn>Alias</Table.HeaderColumn>
						<Table.HeaderColumn>Description</Table.HeaderColumn>
						<Table.HeaderColumn>Status</Table.HeaderColumn>
						<Table.HeaderColumn>Created At</Table.HeaderColumn>
						<Table.HeaderColumn>Actions</Table.HeaderColumn>

					</Table.HeaderRow>
				</Table.Header>
				<Table.Body>
					{project.experiments.length > 0 &&
						project.experiments.map((exp: IExperiment) => (
							<Table.BodyRow key={exp._id} onClick={() => navigate(Pages.Experiment.replace(":id", exp._id))} clickable={true}

							>
								<Table.BodyCell>{exp.alias}</Table.BodyCell>
								<Table.BodyCell>{exp.description || "---"}</Table.BodyCell>
								<Table.BodyCell>{exp.status || "---"}</Table.BodyCell>
								<Table.BodyCell>{new Date(exp.createdAt).toLocaleString()}</Table.BodyCell>
								<Table.BodyCell>
									<S.Cell
										onClick={(e: React.MouseEvent) => e.stopPropagation()}
									>
										<Dropdown.Root
											variant="outlined"
											anchor={
												<IconButton>
													<AlertCircle size={20} color={theme.main.tertiary} fill={theme.main.tertiaryGhost} />
												</IconButton>
											}>
											<Dropdown.Item

												onClick={
													() => {
														dispatch(projectActions.deleteExperiment(exp._id));
													}
												}
											>
												<Trash2 color={theme.main.danger} size={20} />

											</Dropdown.Item>



										</Dropdown.Root>
									</S.Cell>
								</Table.BodyCell>

							</Table.BodyRow>
						))}
				</Table.Body>
			</Table.Root>
		</S.Container>
	);
};

export default ProjectDetail;
