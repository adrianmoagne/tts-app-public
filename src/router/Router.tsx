import { Entrypoint } from "@/components";
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Pages } from "../@types";
import ProtectedRoute from "./ProtectedRoute";

const LoginModule = lazy(() => import("../pages/Login/Login"));
const SignUpModule = lazy(() => import("../pages/SignUp/SignUp"));
const ProjectsModule = lazy(() => import("../pages/Projects/Projects"));
const ProjectDetailModule = lazy(() => import("../pages/Projects/ProjectDetail"));
const ProjectExperimentCreateModule = lazy(() => import("../pages/Projects/ExperimentCreate"));
const ExperimentModule = lazy(() => import("../pages/Experiment/Experiment"));
const MediasModule = lazy(() => import("../pages/Medias/Medias"));
const FormsModule = lazy(() => import("../pages/Forms/Forms"));
const BuilderModule = lazy(() => import("../pages/Builder/Builder"));
const ScreenBuilderModule = lazy(() => import("../pages/ScreenBuilder/ScreenBuilder"));

// Preview pages (authenticated, for researchers)
const ExperimentPreviewMosModule = lazy(() => import("../pages/ExperimentPreviewMos/ExperimentPreviewMos"));
const ExperimentPreviewEyeTrackingModule = lazy(() => import("../pages/ExperimentPreviewEyeTracking/ExperimentPreviewEyeTracking"));

// Participant pages (public, token-based)
const ExperimentParticipantMosModule = lazy(() => import("../pages/ExperimentParticipantMos/ExperimentParticipantMos"));
const ExperimentParticipantEyeTrackingModule = lazy(() => import("../pages/ExperimentParticipantEyeTracking/ExperimentParticipantEyeTracking"));

const router = createBrowserRouter([
	{
		path: Pages.Base,
		element: <Navigate to={Pages.Projects} replace />,
	},
	{
		path: Pages.Login,
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<LoginModule />
			</Suspense>
		),
	},
	{
		path: Pages.SignUp,
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<SignUpModule />
			</Suspense>
		),
	},
	{
		path: Pages.Projects,
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<ProtectedRoute>
					<Entrypoint>
						<ProjectsModule />
					</Entrypoint>
				</ProtectedRoute>
			</Suspense>
		),
	},
	{
		path: Pages.ProjectDetail,
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<ProtectedRoute>
					<Entrypoint>
						<ProjectDetailModule />
					</Entrypoint>
				</ProtectedRoute>
			</Suspense>
		),
	},
	{
		path: Pages.ProjectExperimentCreate,
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<ProtectedRoute>
					<Entrypoint>
						<ProjectExperimentCreateModule />
					</Entrypoint>
				</ProtectedRoute>
			</Suspense>
		),
	},
	{
		path: Pages.Experiment,
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<ProtectedRoute>
					<Entrypoint>
						<ExperimentModule />
					</Entrypoint>
				</ProtectedRoute>
			</Suspense>
		),
	},
	// Preview routes (authenticated)
	{
		path: Pages.ExperimentPreviewEyeTracking,
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<ProtectedRoute>
					<ExperimentPreviewEyeTrackingModule />
				</ProtectedRoute>
			</Suspense>
		),
	},
	{
		path: Pages.ExperimentPreviewMos,
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<ProtectedRoute>
					<ExperimentPreviewMosModule />
				</ProtectedRoute>
			</Suspense>
		),
	},
	{
		path: Pages.Medias,
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<ProtectedRoute>
					<Entrypoint>
						<MediasModule />
					</Entrypoint>
				</ProtectedRoute>
			</Suspense>
		),
	},
	{
		path: Pages.Forms,
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<ProtectedRoute>
					<Entrypoint>
						<FormsModule />
					</Entrypoint>
				</ProtectedRoute>
			</Suspense>
		),
	},
	{
		path: Pages.Builder,
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<ProtectedRoute>
					<Entrypoint>
						<BuilderModule />
					</Entrypoint>
				</ProtectedRoute>
			</Suspense>
		),
	},
	{
		path: Pages.ScreenBuilder,
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<ProtectedRoute>
					<Entrypoint>
						<ScreenBuilderModule />
					</Entrypoint>
				</ProtectedRoute>
			</Suspense>
		),
	},
	// Public participant routes (no auth required)
	{
		path: Pages.ExperimentParticipantMos,
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<ExperimentParticipantMosModule />
			</Suspense>
		),
	},
	{
		path: Pages.ExperimentParticipantEyeTracking,
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<ExperimentParticipantEyeTrackingModule />
			</Suspense>
		),
	},
]);

export default router;
