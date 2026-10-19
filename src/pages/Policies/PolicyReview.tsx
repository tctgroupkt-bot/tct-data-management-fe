import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store.ts";
import PageMeta from "../../components/common/PageMeta.tsx";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import TableComponentCard from "../../components/common/product/TableComponentCard.tsx";
import { useApi } from "../../hooks/useApi.ts";
import PolicyTableComponent from "../../components/tables/policy/PolicyTableComponent.tsx";

const PolicyReview = () => {
  const { policyStore } = useStore();
  const { isOnline } = useApi();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOnline) {
      policyStore.searchPolicies();
    }
  }, [isOnline, policyStore]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    policyStore.setTerm(term);
  };

  const handleSearchSubmit = async () => {
    await policyStore.searchPolicies();
  };

  return (
    <>
      <PageMeta
        title="TCT Homemart Data Management"
        description="Ôn tập và tra cứu chính sách"
      />
      <PageBreadcrumb pageTitle="Ôn tập chính sách" />

      <TableComponentCard
        title="Danh sách chính sách"
        className="text-white"
        onSearch={handleSearch}
        onSearchSubmit={handleSearchSubmit}
        searchTerm={searchTerm}
        isOnline={isOnline}
        loading={policyStore.loading}
      >
        <PolicyTableComponent
          data={policyStore.policyList}
          loading={policyStore.loading}
        />
      </TableComponentCard>
    </>
  );
};

export default observer(PolicyReview);