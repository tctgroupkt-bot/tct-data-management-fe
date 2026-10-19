import VerifyEmailForm from "../../components/auth/VerifyEmailForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function VerifyEmail() {
  return (
    <>
      <PageMeta
        title="TCT Homemart Data Management"
        description="Đây là trang xác thực email của website quản trị dữ liệu sản phẩm của TCT Homemart."
      />
      <AuthLayout>
        <VerifyEmailForm />
      </AuthLayout>
    </>
  );
}