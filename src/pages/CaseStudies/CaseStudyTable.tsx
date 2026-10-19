import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../components/common/PageMeta.tsx";
import TableComponentCard from "../../components/common/product/TableComponentCard.tsx";
import { useStore } from "../../app/stores/store.ts";
import { useApi } from "../../hooks/useApi.ts";
import CaseStudyTableComponent from "../../components/tables/case-study/CaseStudyTableComponent.tsx";
import { CaseStudyType } from "../../app/models/caseStudy/caseStudy.model.ts";

const CaseStudyTable = () => {
    const { caseStudyStore } = useStore();
    const { isOnline } = useApi();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (isOnline) {
            caseStudyStore.searchCaseStudies();
        }
    }, [isOnline, caseStudyStore]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        caseStudyStore.setTerm(term);
    };

    const handleCaseTypeChange = (value: string) => {
        caseStudyStore.setCaseType(value as CaseStudyType | "");
    };

    const handleSearchSubmit = async () => {
        await caseStudyStore.searchCaseStudies();
    };

    return (
        <>
            <PageMeta
                title="TCT Homemart Data Management"
                description="Danh sách tình huống (Case Study)"
            />
            <PageBreadcrumb pageTitle="Các tình huống" />

            <div className="space-y-6">
                <TableComponentCard
                    title="Bảng Case Study"
                    addButtonLink="admin/create-case-study"
                    addButtonText="Tạo tình huống mới"
                    className="text-white"
                    onSearch={handleSearch}
                    onSearchSubmit={handleSearchSubmit}
                    searchTerm={searchTerm}
                    isOnline={isOnline}
                    loading={caseStudyStore.loading}
                    additionalButtons={
                        <select
                            className="ml-2 border rounded px-2 py-1.5 text-sm text-black dark:text-white bg-white dark:bg-gray-800"
                            value={caseStudyStore.caseType}
                            onChange={(e) => handleCaseTypeChange(e.target.value)}
                        >
                            <option value="">Tất cả loại</option>
                            <option value="COMMON">Chung</option>
                            <option value="SPECIFIC">Đặc biệt</option>
                        </select>
                    }
                >
                    <CaseStudyTableComponent
                        data={caseStudyStore.caseStudyList}
                        loading={caseStudyStore.loading}
                    />
                </TableComponentCard>
            </div>
        </>
    );
};

export default observer(CaseStudyTable);