import "../globals.css";
import LeftSidebar from "@/components/common/LeftSidebar";
import Header from "@/components/common/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <div className="fixed left-0 top-0 h-full">
        <LeftSidebar />
      </div>

      <div className="w-full h-full md:pl-[72px] pl-0">
        <header className="fixed top-0 right-0 h-16 md:left-[72px] left-0 bg-white border-b border-gray-200 z-10">
          <Header />
        </header>


        <main className="pt-16 overflow-y-auto overflow-x-hidden w-full">
          <div className="p-4 md:p-6 w-full max-w-[100vw] overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

