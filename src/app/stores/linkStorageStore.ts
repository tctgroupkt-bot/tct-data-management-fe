import { action, makeObservable, observable, runInAction } from "mobx";
import agent from "../api/agent.ts";
import { toast } from "react-toastify";
import { LinkStorageDto } from "../models/storage/linkStorage.model.ts";
import {
  AddLinkStorageDto,
  UpdateLinkStorageDto,
} from "../models/storage/linkStorage.model.ts";
import BaseStore from "./baseStore.ts";
// import { OfflineStorage } from '../services/offlineStorage.ts'

export default class LinkStorageStore extends BaseStore {
  linkStorageList: LinkStorageDto[] = [];
  linkStorageRegistry = new Map<string, LinkStorageDto>();
  loading = false;
  term: string = "";

  linkStorageForm: AddLinkStorageDto = {
    name: "",
    url: "",
  };

  linkStorageFormUpdate: UpdateLinkStorageDto = {
    name: "",
    url: "",
  };

  constructor() {
    super();
    makeObservable(this, {
      linkStorageList: observable,
      linkStorageRegistry: observable,
      loading: observable,
      term: observable,
      linkStorageForm: observable,
      linkStorageFormUpdate: observable,
      setLinkStorageList: action,
      setTerm: action,
      loadLinkStorages: action,
      updateLinkStorageForm: action,
      updateLinkStorage: action,
      updateLinkStorageFormUpdate: action,
      resetLinkStorageForm: action,
      deleteLinkStorage: action,
    });
  }

  setLinkStorageList = (list: LinkStorageDto[]) => {
    this.linkStorageList = list;
    this.linkStorageRegistry.clear();
    list.forEach((linkStorage) => {
      if (linkStorage.name != null)
        this.linkStorageRegistry.set(linkStorage.name, linkStorage);
    });
    //Update metadata in localStorage
    // const currentMetadata = OfflineStorage.getMetadata();
    // if (currentMetadata) {
    //   // Metadata type doesn't include link storage by default, cast to any to extend
    //   (currentMetadata as any).linkStorageDtos = list.map((linkStorage) => ({
    //     name: linkStorage.name,
    //     url: linkStorage.url,
    //   }));
    //   OfflineStorage.saveMetadata(currentMetadata);
    // }
  };

  setTerm = (term: string) => {
    this.term = term;
    this.loadLinkStorages();
  };

  searchLinkStorage = async () => {
    await this.loadLinkStorages();
  };

  loadLinkStorages = async () => {
    runInAction(() => {
      this.loading = true;
    });
    try {
      // Lấy dữ liệu localStorage (nếu có)
      const cached = localStorage.getItem("linkStorageList");
      let cachedData: LinkStorageDto[] = [];
      if (cached) {
        cachedData = JSON.parse(cached);
        runInAction(() => {
          this.linkStorageList = cachedData;
          this.loading = false;
          this.linkStorageRegistry.clear();
          cachedData.forEach((linkStorage: any) => {
            if (linkStorage.name != null)
              this.linkStorageRegistry.set(linkStorage.name, linkStorage);
          });
        });
      }

      // Gọi API lấy dữ liệu mới nhất
      const result = await agent.LinkStorage.linkStorageList();
      console.log("linkStorageList API result:", result);
      const apiData = result.data || [];

      // So sánh dữ liệu API với localStorage
      if (JSON.stringify(apiData) !== JSON.stringify(cachedData)) {
        // Nếu khác biệt thì cập nhật lại localStorage và state
        runInAction(() => {
          this.linkStorageList = apiData;
          this.linkStorageRegistry.clear();
          this.loading = false;
          apiData.forEach((linkStorage) => {
            if (linkStorage.name != null)
              this.linkStorageRegistry.set(linkStorage.name, linkStorage);
          });
          localStorage.setItem("linkStorageList", JSON.stringify(apiData));
        });
      } else {
        // Nếu dữ liệu API giống cache thì chỉ cần tắt loading
        runInAction(() => {
          this.loading = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load link storage", error);
      toast.error("Lỗi khi tải dữ liệu kho.");
    }
  };

  updateLinkStorageForm = <K extends keyof AddLinkStorageDto>(
    field: K,
    value: AddLinkStorageDto[K],
  ) => {
    runInAction(() => {
      this.linkStorageForm[field] = value;
    });
  };

  resetLinkStorageForm = () => {
    runInAction(() => {
      this.linkStorageForm = {
        name: "",
        url: "",
      };
    });
  };

  addLinkStorage = async () => {
    runInAction(() => {
      this.loading = true;
    });
    try {
      const result = await agent.LinkStorage.addLinkStorage(
        this.linkStorageForm,
      );
      console.log("addLinkStorage API result:", result);
      if (result.success) {
        runInAction(() => {
          toast.success("Nhà máy đã được tạo thành công.");
          // Thêm mới vào list hiện tại
          const newItem = { id: Number(result.data), ...this.linkStorageForm };
          this.linkStorageList = [...this.linkStorageList, newItem];
          // Cập nhật localStorage
          localStorage.setItem(
            "linkStorageList",
            JSON.stringify(this.linkStorageList),
          );
          this.linkStorageForm.name = "";
          this.linkStorageForm.url = "";
          this.loading = false;
        });
        return true;
      }
      runInAction(() => {
        this.loading = false;
      });
      return false;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to add link storage", error);
      toast.error("Lỗi khi tạo kho.");
    }
  };

  updateLinkStorage = async (linkId: number) => {
    runInAction(() => {
      this.loading = true;
    });
    try {
      const result = await agent.LinkStorage.updateLinkStorage(
        linkId,
        this.linkStorageFormUpdate,
      );
      if (result.success) {
        runInAction(() => {
          toast.success("Cập nhật kho thành công.");
          // Cập nhật lại item trong list
          this.linkStorageList = this.linkStorageList.map((item) =>
            item.id === linkId
              ? { ...item, ...this.linkStorageFormUpdate }
              : item,
          );
          // Cập nhật localStorage
          localStorage.setItem(
            "linkStorageList",
            JSON.stringify(this.linkStorageList),
          );
          this.resetLinkStorageForm();
          this.loading = false;
        });
        return true;
      }
      runInAction(() => {
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateLinkStorageFormUpdate = <K extends keyof UpdateLinkStorageDto>(
    field: K,
    value: UpdateLinkStorageDto[K],
  ) => {
    runInAction(() => {
      this.linkStorageFormUpdate = {
        ...this.linkStorageFormUpdate,
        [field]: value,
      };
    });
  };

  deleteLinkStorage = async (id: number) => {
    runInAction(() => {
      this.loading = true;
    });
    try {
      const result = await agent.LinkStorage.deleteLinkStorage(id);
      if (result.success) {
        runInAction(() => {
          toast.success(result.data);
          this.loadLinkStorages();
          this.loading = false;
        });
        return true;
      } else {
        runInAction(() => {
          toast.error(result.errors[0]);
          this.loading = false;
        });
        return false;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
