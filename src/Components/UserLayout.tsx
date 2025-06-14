import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-inter text-gray-900">
      <header className="py-4 px-3 mt-1 mx-5 rounded md:px-8 lg:px-10 bg-white shadow-md z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Header />
        </div>
      </header>
      <main className="flex flex-grow items-center justify-center p-4 md:p-8 lg:p-5 max-w-7xl w-full">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 lg:p-10 w-full h-full">
          <Outlet />
        </div>
      </main>
      <footer className="py-8 px-6 md:px-12 lg:px-20 bg-gray-800 text-white shadow-inner z-10">
        <div className="max-w-7xl mx-auto">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
