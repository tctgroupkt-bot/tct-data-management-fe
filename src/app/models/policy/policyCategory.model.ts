export interface PolicyCategoryDto {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    createdAt: Date;
}

export interface CreatePolicyCategoryDto {
    name: string;
    description?: string | null;
}

export interface UpdatePolicyCategoryDto {
    name: string;
    description?: string | null;
}