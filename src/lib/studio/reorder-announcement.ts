export type ReorderAnnouncementKey = string | number;

export type ReorderAnnouncementProps = {
	message: string | null;
	eventKey: ReorderAnnouncementKey | null;
	class?: string;
	style?: string;
};
