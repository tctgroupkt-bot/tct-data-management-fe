import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent.ts";
import {
  CaseStudyDetailDto,
  CaseStudyDto,
  CaseStudyType,
  CreateCaseStudyDto,
  UpdateCaseStudyDto,
} from "../models/caseStudy/caseStudy.model.ts";

export default class CaseStudyStore {
  caseStudyList: CaseStudyDto[] = [];
  selectedCaseStudy: CaseStudyDetailDto | null = null;
  loading = false;
  term = "";
  caseType: CaseStudyType | "" = "";

  caseStudyForm: CreateCaseStudyDto = {
    title: "",
    content: "",
    caseType: "SPECIFIC",
    status: "PUBLISHED",
  };

  caseStudyUpdateForm: UpdateCaseStudyDto = {
    title: "",
    content: "",
    caseType: "SPECIFIC",
    status: "PUBLISHED",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setTerm = (term: string) => {
    this.term = term;
  };

  setCaseType = (caseType: CaseStudyType | "") => {
    this.caseType = caseType;
  };

  updateCaseStudyForm = <K extends keyof CreateCaseStudyDto>(
    key: K,
    value: CreateCaseStudyDto[K]
  ) => {
    this.caseStudyForm[key] = value;
  };

  updateCaseStudyUpdateForm = <K extends keyof UpdateCaseStudyDto>(
    key: K,
    value: UpdateCaseStudyDto[K]
  ) => {
    this.caseStudyUpdateForm[key] = value;
  };

  resetCaseStudyForm = () => {
    this.caseStudyForm = {
      title: "",
      content: "",
      caseType: "SPECIFIC",
      status: "PUBLISHED",
    };
  };

  resetCaseStudyUpdateForm = () => {
    this.caseStudyUpdateForm = {
      title: "",
      content: "",
      caseType: "SPECIFIC",
      status: "PUBLISHED",
    };
  };

  loadCaseStudies = async (term?: string, caseType?: CaseStudyType) => {
    this.loading = true;
    try {
      const result = await agent.CaseStudy.caseStudyList(term, caseType);
      runInAction(() => {
        this.caseStudyList = result.data || [];
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load case studies", error);
    //   toast.error("Lỗi khi tải danh sách case study.");
    }
  };

  searchCaseStudies = async () => {
    await this.loadCaseStudies(this.term || undefined, this.caseType || undefined);
  };

  loadCaseStudyById = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.CaseStudy.getCaseStudyById(id);
      runInAction(() => {
        this.selectedCaseStudy = result.data || null;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load case study detail", error);
      toast.error("Lỗi khi tải chi tiết case study.");
    }
  };

  createCaseStudy = async () => {
    this.loading = true;
    try {
      const result = await agent.CaseStudy.createCaseStudy(this.caseStudyForm);
      runInAction(() => {
        this.loading = false;
      });

      if (result.success) {
        toast.success(result.data || "Tạo case study thành công.");
        this.resetCaseStudyForm();
        await this.searchCaseStudies();
        return true;
      }

      toast.error(result.errors?.[0] || "Lỗi khi tạo case study.");
      return false;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to create case study", error);
      toast.error("Lỗi khi tạo case study.");
      return false;
    }
  };

  updateCaseStudy = async (id: number, payload?: UpdateCaseStudyDto) => {
    this.loading = true;
    try {
      const result = await agent.CaseStudy.updateCaseStudy(
        id,
        payload || this.caseStudyUpdateForm
      );

      runInAction(() => {
        this.loading = false;
      });

      if (result.success) {
        toast.success(result.data || "Cập nhật case study thành công.");
        await this.searchCaseStudies();
        if (this.selectedCaseStudy?.id === id) {
          await this.loadCaseStudyById(id);
        }
        return true;
      }

      toast.error(result.errors?.[0] || "Lỗi khi cập nhật case study.");
      return false;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to update case study", error);
      toast.error("Lỗi khi cập nhật case study.");
      return false;
    }
  };

  deleteCaseStudy = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.CaseStudy.deleteCaseStudy(id);

      runInAction(() => {
        this.loading = false;
      });

      if (result.success) {
        toast.success(result.data || "Xóa case study thành công.");
        runInAction(() => {
          this.caseStudyList = this.caseStudyList.filter((item) => item.id !== id);
          if (this.selectedCaseStudy?.id === id) this.selectedCaseStudy = null;
        });
        return true;
      }

      toast.error(result.errors?.[0] || "Lỗi khi xóa case study.");
      return false;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to delete case study", error);
      toast.error("Lỗi khi xóa case study.");
      return false;
    }
  };

  toggleLikeCaseStudy = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.CaseStudy.toggleLikeCaseStudy(id);

      runInAction(() => {
        this.loading = false;
      });

      if (result.success && result.data) {
        runInAction(() => {
          this.caseStudyList = this.caseStudyList.map((item) =>
            item.id === id ? { ...item, likeCount: result.data!.likeCount } : item
          );

          if (this.selectedCaseStudy?.id === id && result.data) {
            this.selectedCaseStudy = {
              ...this.selectedCaseStudy,
              likeCount: result.data.likeCount,
              isLikedByCurrentUser: result.data.isLiked,
            };
          }
        });
        return true;
      }

      toast.error(result.errors?.[0] || "Lỗi khi cập nhật lượt thích.");
      return false;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to toggle like case study", error);
      toast.error("Lỗi khi cập nhật lượt thích.");
      return false;
    }
  };

  toggleVerifyCaseStudy = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.CaseStudy.toggleVerifyCaseStudy(id);

      runInAction(() => {
        this.loading = false;
      });

      if (result.success && result.data) {
        runInAction(() => {
          this.caseStudyList = this.caseStudyList.map((item) =>
            item.id === id
              ? { ...item, isAdminVerified: result.data!.isAdminVerified }
              : item
          );

          if (this.selectedCaseStudy?.id === id && result.data) {
            this.selectedCaseStudy = {
              ...this.selectedCaseStudy,
              isAdminVerified: result.data.isAdminVerified,
            };
          }
        });
        return true;
      }

      toast.error(result.errors?.[0] || "Lỗi khi cập nhật xác thực.");
      return false;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to toggle verify case study", error);
      toast.error("Lỗi khi cập nhật xác thực.");
      return false;
    }
  };
}