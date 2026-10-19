import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="TCT Homemart Data Management"
        description="Đây là trang đăng nhập của website quản trị dữ liệu sản phẩm của TCT Homemart."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
