export type CaseStudyType = "COMMON" | "SPECIFIC";
export type CaseStudyStatus = "PUBLISHED" | "DRAFT";

export interface CaseStudyDto {
  id: number;
  title: string;
  caseType: CaseStudyType;
  status: CaseStudyStatus;
  likeCount: number;
  isAdminVerified: boolean;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CaseStudyDetailDto {
  id: number;
  title: string;
  content: string;
  caseType: CaseStudyType;
  status: CaseStudyStatus;
  likeCount: number;
  isAdminVerified: boolean;
  isLikedByCurrentUser: boolean;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCaseStudyDto {
  title: string;
  content: string;
  caseType: CaseStudyType;
  status?: CaseStudyStatus;
}

export interface UpdateCaseStudyDto {
  title: string;
  content: string;
  caseType: CaseStudyType;
  status: CaseStudyStatus;
}

export interface CaseStudyLikeToggleDto {
  caseStudyId: number;
  isLiked: boolean;
  likeCount: number;
}

export interface CaseStudyVerifyToggleDto {
  caseStudyId: number;
  isAdminVerified: boolean;
}