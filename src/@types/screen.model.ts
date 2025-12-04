export type GridType = "1x1" | "2x2" | "3x3";
export type GridSubtype = "equal" | "v_centered" | "h_centered";
export type ScreenItemType = "media" | "form" | "text" | "template";
export type TemplateType = "image" | "audio" | "text";
export type ScreenItemPosition = "center" | "left" | "right";
export type ItemArea = "heading" | "content" | "footer";
export type HAlign = "center" | "left" | "right";
export type VAlign = "top" | "center" | "bottom";
import type { IMedia } from "./medias.model";
export interface ScreenItem {
	_id: string;
	type: ScreenItemType;
	template_type?: TemplateType;
	position: ScreenItemPosition;
	area: ItemArea;
	v_align: VAlign;
	h_align: HAlign;
	media?: IMedia;
}

export interface IScreen {
	_id: string;
	alias: string;
	description?: string;
	grid: {
		type: GridType;
		subtype: GridSubtype;
	};
	items: ScreenItem[];
	createdAt: Date | string;
	updatedAt?: Date | string;
}

export const audioMockScreenTemplate: IScreen = {
	_id: "1",
	createdAt: new Date(),
	alias: "Audio template",
	description: "Create a screen from template",
	grid: {
		type: "1x1",
		subtype: "equal",
	},
	items: [
		{
			_id: "1",
			type: "template",
			template_type: "audio",
			position: "center",
			area: "heading",
			v_align: "center",
			h_align: "center",
		},
	],
};

export const twoImagesScreenTemplate: IScreen = {
	_id: "2",
	createdAt: new Date(),
	alias: "Two images with audio template",
	description: "Create a screen from template",
	grid: {
		type: "3x3",
		subtype: "equal",
	},
	items: [
		{
			_id: "14123412",
			type: "template",
			template_type: "image",
			position: "left",
			area: "content",
			v_align: "center",
			h_align: "center",
		},
		{
			_id: "2412421",
			type: "template",
			template_type: "image",
			position: "right",
			area: "content",
			v_align: "center",
			h_align: "center",
		},
		{
			_id: "2241412",
			type: "template",
			template_type: "audio",
			position: "center",
			area: "heading",
			v_align: "center",
			h_align: "center",
		},
	],
};

export const blankScreenTemplate: IScreen = {
	_id: "3",
	createdAt: new Date(),
	alias: "Blank Screen",
	description: "Create a screen from scratch",
	grid: {
		type: "3x3",
		subtype: "equal",
	},
	items: [],
};
