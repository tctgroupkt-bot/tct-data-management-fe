import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent.ts";
import {
  CreatePolicyDto,
  PolicyDetailDto,
  PolicyDto,
  UpdatePolicyDto,
} from "../models/policy/policy.model.ts";

export default class PolicyStore {
  policyList: PolicyDto[] = [];
  selectedPolicy: PolicyDetailDto | null = null;
  loading = false;
  term = "";
  department = "";

  policyForm: CreatePolicyDto = {
    title: "",
    content: "",
    categoryId: 0,
    status: "PUBLISHED",
  };

  policyUpdateForm: UpdatePolicyDto = {
    id: 0,
    title: "",
    content: "",
    categoryId: 0,
    status: "PUBLISHED",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setTerm = (term: string) => {
    this.term = term;
  };

  setDepartment = (department: string) => {
    this.department = department;
  };

  updatePolicyForm = <K extends keyof CreatePolicyDto>(
    key: K,
    value: CreatePolicyDto[K]
  ) => {
    this.policyForm[key] = value;
  };

  updatePolicyUpdateForm = <K extends keyof UpdatePolicyDto>(
    key: K,
    value: UpdatePolicyDto[K]
  ) => {
    this.policyUpdateForm[key] = value;
  };

  resetPolicyForm = () => {
    this.policyForm = {
      title: "",
      content: "",
      categoryId: 0,
      status: "PUBLISHED",
    };
  };

  resetPolicyUpdateForm = () => {
    this.policyUpdateForm = {
      id: 0,
      title: "",
      content: "",
      categoryId: 0,
      status: "PUBLISHED",
    };
  };

  loadPolicies = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.Policy.policyList(term);
      runInAction(() => {
        this.policyList = result.data || [];
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load policies", error);
      toast.error("Lỗi khi tải danh sách chính sách.");
    }
  };

  searchPolicies = async () => {
    await this.loadPolicies(this.term || undefined);
  };

  loadPolicyById = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.Policy.getPolicyById(id);
      runInAction(() => {
        this.selectedPolicy = result.data || null;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load policy detail", error);
      toast.error("Lỗi khi tải chi tiết chính sách.");
    }
  };

  loadPoliciesByDepartment = async (department?: string) => {
    if (!department) {
      await this.loadPolicies(this.term || undefined);
      return;
    }

    this.loading = true;
    try {
      const result = await agent.Policy.getPoliciesByDepartment(department);
      runInAction(() => {
        this.policyList = result.data || [];
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load policies by department", error);
      toast.error("Lỗi khi tải chính sách theo phòng ban.");
    }
  };

  createPolicy = async () => {
    this.loading = true;
    try {
      const result = await agent.Policy.createPolicy(this.policyForm);

      runInAction(() => {
        this.loading = false;
      });

      if (result.success) {
        toast.success(result.data || "Tạo chính sách thành công.");
        this.resetPolicyForm();
        await this.searchPolicies();
        return true;
      }

      toast.error(result.errors?.[0] || "Lỗi khi tạo chính sách.");
      return false;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to create policy", error);
      toast.error("Lỗi khi tạo chính sách.");
      return false;
    }
  };

  updatePolicy = async (id: number, payload?: UpdatePolicyDto) => {
    this.loading = true;
    try {
      const result = await agent.Policy.updatePolicy(id, payload || this.policyUpdateForm);

      runInAction(() => {
        this.loading = false;
      });

      if (result.success) {
        toast.success(result.data || "Cập nhật chính sách thành công.");
        await this.searchPolicies();
        if (this.selectedPolicy?.id === id) {
          await this.loadPolicyById(id);
        }
        return true;
      }

      toast.error(result.errors?.[0] || "Lỗi khi cập nhật chính sách.");
      return false;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to update policy", error);
      toast.error("Lỗi khi cập nhật chính sách.");
      return false;
    }
  };
}