export interface Post {
	description: string;
	hashtags: string;
	image: string,
	category: string,
	state: boolean,
	username: string,
	imgUser: string,
	name: string,
	likes: number,
	comments: number,
	favourites: number
}
export type UpdateFieldType = 'likes' | 'favourites' | 'comments';