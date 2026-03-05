import Image from "next/image";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Mobile top bar */}
      <header className="flex md:hidden items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-white shrink-0">
        <Image
          src="/logo.png"
          alt="NeuralTrade"
          width={28}
          height={28}
          className="rounded-lg"
        />
        <span className="text-base font-semibold text-gray-900">
          NeuralTrade
        </span>
      </header>

      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
    </div>
  );
}
