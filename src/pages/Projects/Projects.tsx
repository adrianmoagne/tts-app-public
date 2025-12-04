import { Button, Table, Typography, useModal } from "@leux/ui";
import S from "./Projects.styles";
import { useNavigate } from "react-router";
import { type IProject, ModalId, ModalSizes, Pages } from "@/@types";
import { Edit2 } from "react-feather";
import { IconButton, Modals } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import type { StoreDispatch, StoreState } from "@/store";
import { projectActions } from "@/store";
import { useEffect } from "react";

const Projects: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch<StoreDispatch>();
	const { projects } = useSelector((state: StoreState) => state.project);
	const { createModal } = useModal();
	useEffect(() => {
		dispatch(projectActions.fetchProjects());
	}, [dispatch]);

	const handleRowClick = (project: IProject) => {
		navigate(Pages.ProjectDetail.replace(":id", project._id));
	};

	const openNewProjectModal = () => {
		createModal({
			id: ModalId.NewProject,
			title: "New Project",
			children: <Modals.NewProjectModal.Content />,
			width: ModalSizes.NewProject,
			footer: null,
		});
	};

	return (
		<S.Container>
			<Typography variant="h3" textColor="textOne">
				My Projects
			</Typography>
			<S.RowBetween>
				<Button colorScheme="primary" variant="filled" size="small" onClick={openNewProjectModal}>
					Create New
				</Button>
			</S.RowBetween>
			<Table.Root
				variant="bordered"
				height="auto"
				size="small"
				customClass="row-only-borders row-hover"
			>
				<Table.Header>
					<Table.HeaderRow>
						<Table.HeaderColumn>Name</Table.HeaderColumn>
						<Table.HeaderColumn>Description</Table.HeaderColumn>
						<Table.HeaderColumn>Actions</Table.HeaderColumn>
					</Table.HeaderRow>
				</Table.Header>
				<Table.Body>
					{projects.map((p) => (
						<Table.BodyRow
							key={p._id}
							clickable={true}
							onClick={() => {
								handleRowClick(p);
							}}
						>
							<Table.BodyCell>{p.alias}</Table.BodyCell>
							<Table.BodyCell>{p.description}</Table.BodyCell>
							<Table.BodyCell>
								<S.Cell >
									<IconButton icon={<Edit2 size={16} />} onClick={(e) => e.stopPropagation()} />
								</S.Cell>
							</Table.BodyCell>
						</Table.BodyRow>
					))}
				</Table.Body>
			</Table.Root>
		</S.Container>
	);
};

export default Projects;
