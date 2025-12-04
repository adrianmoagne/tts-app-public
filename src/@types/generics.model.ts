import type { SelectOption } from "@leux/ui";

export const LocalStorageKeys = {
	SidebarCollapsed: "tts-sidebar-collapsed",
	I18NLocale: "i18n-locale",
};

export const Pages = {
	Base: "/",
	Login: "/login",
	SignUp: "/signup",
	Admin: "/admin",
	Projects: "/admin/projects",
	ProjectDetail: "/admin/projects/:id",
	ProjectExperimentCreate: "/admin/projects/:id/experiments/new",
	Experiment: "/admin/experiments/:id",
	Medias: "/admin/medias",
	Forms: "/admin/forms",
	Builder: "/admin/builder",
	ScreenBuilder: "/admin/builder/:id",
	// Preview routes (authenticated, for researchers)
	ExperimentPreviewEyeTracking: "/admin/experiment-preview-eyetracking/:id",
	ExperimentPreviewMos: "/admin/experiment-preview-mos/:id",
	// Participant routes (public, token-based)
	ExperimentParticipantEyeTracking: "/experiment/eyetracking/:id",
	ExperimentParticipantMos: "/experiment/mos/:id",
};

export const ModalId = {
	MediaViewer: "media-viewer",
	AppSettings: "app-settings",
	Upload: "upload",
	AddItem: "add-item",
	MediaGallery: "media-gallery",
	GridSettings: "grid-settings",
	SetupNewScreen: "setup-new-screen",
	TemplateGallery: "template-gallery",
	NewProject: "new-project",
	InviteParticipants: "invite-participants",
	NewExperiment: "new-experiment",
};

export const ModalSizes: Record<keyof typeof ModalId, number> = {
	MediaViewer: 720,
	AppSettings: 480,
	Upload: 520,
	AddItem: 300,
	MediaGallery: 600,
	GridSettings: 420,
	SetupNewScreen: 700,
	TemplateGallery: 1000,
	NewProject: 400,
	InviteParticipants: 500,
	NewExperiment: 480,
};

export const LocalesArr: SelectOption[] = [
	{
		label: "English (US)",
		value: "en",
	},
	{
		label: "Português (Brasil)",
		value: "pt-BR",
	},
];
