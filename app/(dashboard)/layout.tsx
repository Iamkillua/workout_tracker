import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 pb-24 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
