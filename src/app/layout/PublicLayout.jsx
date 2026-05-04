import SiteFooter from "@/shared/components/SiteFooter";

export default function PublicLayout({ children, onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <div className="flex-1">
        {children}
      </div>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  );
}
