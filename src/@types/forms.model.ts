export type IFormStatus = "enabled" | "disabled";

export type IFormAction = "clear" | "back" | "continue";

export interface IForm {
	_id: string;
	alias: string;
	inputs_count: number;
	used_in_count: number;
	status: IFormStatus;
	actions?: IFormAction[];
	inputs?: IFormInput[];
	created_at: string;
	updated_at: string;
}

export interface IFormInput {
	type: "checkbox" | "text" | "textarea" | "radio_group" | "select";
	label: string;
	placeholder: string;
	key: string;
	options: {
		label: string;
		value: string;
	};
}

export const formsMock: IForm[] = [
	{
		_id: "1",
		alias: "Contact Form",
		inputs_count: 3,
		used_in_count: 5,
		status: "enabled",
		actions: ["clear", "back", "continue"],
		inputs: [],
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		_id: "2",
		alias: "Feedback Form",
		inputs_count: 4,
		used_in_count: 2,
		status: "disabled",
		actions: ["clear", "continue"],
		inputs: [],
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
];
