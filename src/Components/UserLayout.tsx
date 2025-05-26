import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex my-4 mx-20 p-4 border">
        <Header />
      </header>
      <main className="flex-grow my-4 mx-20 p-4 border">
        <Outlet />
      </main>
      <footer className="flex my-4 mx-20 p-4 border">
        <Footer />
      </footer>
    </div>
  );
}
