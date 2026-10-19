export interface CreatePolicyDto {
    title: string;
    content: string;
    categoryId: number;
    status: "DRAFT" | "PUBLISHED";
}

export interface UpdatePolicyDto {
    id: number;
    title: string;
    content: string;
    categoryId: number;
    status: string;
}

export interface PolicyDto {
    id: number;
    title: string;
    slug: string;
    status: string;
    categoryName: string;
    authorName: string;
    updatedAt: string;
}

export interface PolicyDetailDto {
    id: number;
    title: string;
    slug: string;
    content: string;
    status: string;
    categoryId: number;
    categoryName: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
}