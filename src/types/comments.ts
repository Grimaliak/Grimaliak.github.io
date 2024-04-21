export type commentType = {
    id: number;
    text: string;
    created: string;
    author: number;
    parent: number | null;
    likes: number;
}