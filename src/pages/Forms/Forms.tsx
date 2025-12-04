import { useI18nContext } from "@/i18n/i18n-react";
import { Badge, Button, Pagination, Select, Table, Typography } from "@leux/ui";
import { useState } from "react";
import S from "./Forms.styles";
import { formsMock, type IForm } from "@/@types";
import { format } from "date-fns";

const Forms: React.FC = () => {
	const { LL } = useI18nContext();

	const [forms] = useState<IForm[]>(formsMock);

	return (
		<S.Container>
			<S.Header>
				<S.RowBetween>
					<Typography variant="h3" textColor="textOne">
						{LL.Forms.Title()}
					</Typography>
					<Button colorScheme="primary">{LL.Forms.Buttons.Build()}</Button>
				</S.RowBetween>
				<Typography variant="caption" textColor="placeholder">
					{LL.Forms.Subtitle()}
				</Typography>
			</S.Header>
			<S.Filters>
				<Badge size="large" clickable colorScheme="secondary" variant="filled">
					{LL.Forms.Filters.All()}
				</Badge>
				<Badge size="large" clickable>
					{LL.Forms.Filters.InUse()}
				</Badge>
				<Select
					customClass="custom-select"
					options={[
						{ label: LL.Forms.Filters.Enabled(), value: "enabled" },
						{ label: LL.Forms.Filters.Disabled(), value: "disabled" },
					]}
					placeholder={LL.Forms.Filters.Status()}
				/>
			</S.Filters>
			<Table.Root variant="bordered" height="100%">
				<Table.Header>
					<Table.HeaderRow>
						<Table.HeaderColumn>{LL.Forms.Headers.Alias()}</Table.HeaderColumn>
						<Table.HeaderColumn>{LL.Forms.Headers.Items()}</Table.HeaderColumn>
						<Table.HeaderColumn>{LL.Forms.Headers.UsedIn()}</Table.HeaderColumn>
						<Table.HeaderColumn>{LL.Forms.Headers.Status()}</Table.HeaderColumn>
						<Table.HeaderColumn>{LL.Forms.Headers.CreatedAt()}</Table.HeaderColumn>
						<Table.HeaderColumn>{LL.Forms.Headers.Actions()}</Table.HeaderColumn>
					</Table.HeaderRow>
				</Table.Header>
				<Table.Body>
					{forms.map((form) => (
						<Table.BodyRow key={form._id}>
							<Table.BodyCell>{form.alias}</Table.BodyCell>
							<Table.BodyCell>{form.inputs_count}</Table.BodyCell>
							<Table.BodyCell>{form.used_in_count}</Table.BodyCell>
							<Table.BodyCell>
								<Badge
									colorScheme={form.status === "enabled" ? "success" : "default"}
									variant="ghost"
								>
									{form.status}
								</Badge>
							</Table.BodyCell>
							<Table.BodyCell>{format(new Date(form.created_at), "dd/MM/yy HH:mm")}</Table.BodyCell>
							<Table.BodyCell>
								<></>
							</Table.BodyCell>
						</Table.BodyRow>
					))}
				</Table.Body>
			</Table.Root>
			<Pagination
				currentPage={1}
				totalPages={10}
				itemsPerPage={10}
				totalItems={forms.length}
				showPageSizeChanger
			/>
		</S.Container>
	);
};

export default Forms;
