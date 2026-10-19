import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent.ts";
import {
  CreatePolicyCategoryDto,
  PolicyCategoryDto,
  UpdatePolicyCategoryDto,
} from "../models/policy/policyCategory.model.ts";

export default class PolicyCategoryStore {
  policyCategoryList: PolicyCategoryDto[] = [];
  selectedPolicyCategory: PolicyCategoryDto | null = null;
  loading = false;
  term = "";

  policyCategoryForm: CreatePolicyCategoryDto = {
    name: "",
    description: "",
  };

  policyCategoryUpdateForm: UpdatePolicyCategoryDto = {
    name: "",
    description: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setTerm = (term: string) => {
    this.term = term;
  };

  updatePolicyCategoryForm = <K extends keyof CreatePolicyCategoryDto>(
    key: K,
    value: CreatePolicyCategoryDto[K]
  ) => {
    this.policyCategoryForm[key] = value;
  };

  updatePolicyCategoryUpdateForm = <K extends keyof UpdatePolicyCategoryDto>(
    key: K,
    value: UpdatePolicyCategoryDto[K]
  ) => {
    this.policyCategoryUpdateForm[key] = value;
  };

  resetPolicyCategoryForm = () => {
    this.policyCategoryForm = {
      name: "",
      description: "",
    };
  };

  resetPolicyCategoryUpdateForm = () => {
    this.policyCategoryUpdateForm = {
      name: "",
      description: "",
    };
  };

  loadPolicyCategories = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.PolicyCategory.policyCategoryList(term);
      runInAction(() => {
        this.policyCategoryList = result.data || [];
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load policy categories", error);
      toast.error("Lỗi khi tải danh sách danh mục chính sách.");
    }
  };

  searchPolicyCategories = async () => {
    await this.loadPolicyCategories(this.term || undefined);
  };

  loadPolicyCategoryById = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.PolicyCategory.getPolicyCategoryById(id);
      runInAction(() => {
        this.selectedPolicyCategory = result.data || null;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load policy category detail", error);
      toast.error("Lỗi khi tải chi tiết danh mục chính sách.");
    }
  };

  createPolicyCategory = async () => {
    this.loading = true;
    try {
      const result = await agent.PolicyCategory.createPolicyCategory(this.policyCategoryForm);

      runInAction(() => {
        this.loading = false;
      });

      if (result.success) {
        toast.success(result.data || "Tạo danh mục chính sách thành công.");
        this.resetPolicyCategoryForm();
        await this.searchPolicyCategories();
        return true;
      }

      toast.error(result.errors?.[0] || "Lỗi khi tạo danh mục chính sách.");
      return false;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to create policy category", error);
      toast.error("Lỗi khi tạo danh mục chính sách.");
      return false;
    }
  };

  updatePolicyCategory = async (id: number, payload?: UpdatePolicyCategoryDto) => {
    this.loading = true;
    try {
      const result = await agent.PolicyCategory.updatePolicyCategory(
        id,
        payload || this.policyCategoryUpdateForm
      );

      runInAction(() => {
        this.loading = false;
      });

      if (result.success) {
        toast.success(result.data || "Cập nhật danh mục chính sách thành công.");
        await this.searchPolicyCategories();
        if (this.selectedPolicyCategory?.id === id) {
          await this.loadPolicyCategoryById(id);
        }
        return true;
      }

      toast.error(result.errors?.[0] || "Lỗi khi cập nhật danh mục chính sách.");
      return false;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to update policy category", error);
      toast.error("Lỗi khi cập nhật danh mục chính sách.");
      return false;
    }
  };

  deletePolicyCategory = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.PolicyCategory.deletePolicyCategory(id);

      runInAction(() => {
        this.loading = false;
      });

      if (result.success) {
        toast.success(result.data || "Xóa danh mục chính sách thành công.");
        runInAction(() => {
          this.policyCategoryList = this.policyCategoryList.filter((item) => item.id !== id);
          if (this.selectedPolicyCategory?.id === id) this.selectedPolicyCategory = null;
        });
        return true;
      }

      toast.error(result.errors?.[0] || "Lỗi khi xóa danh mục chính sách.");
      return false;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to delete policy category", error);
      toast.error("Lỗi khi xóa danh mục chính sách.");
      return false;
    }
  };
}