import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import LoginForm from "../components/LoginForm.tsx";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
