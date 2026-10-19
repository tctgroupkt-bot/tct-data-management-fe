import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function ResetPassword() {
  return (
    <>
      <PageMeta
        title="TCT Homemart Data Management"
        description="Đây là trang đặt lại mật khẩu của website quản trị dữ liệu sản phẩm của TCT Homemart. Vui lòng nhập thông tin đăng nhập của bạn để truy cập vào hệ thống quản lý dữ liệu sản phẩm của chúng tôi."
      />
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </>
  );
}