import React from "react";
import { useSavedDeals } from "../hooks/useSavedDeals";
import { Loader } from "@/shared/ui/loader";
import { Card } from "@/shared/ui/card";
import { Bookmark, Rocket, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import ExploreDealCard from "./ExploreDealCard";
import { useNavigate } from "react-router";

export default function SavedDealsPage() {
  const { data: savedDeals, isLoading, error } = useSavedDeals();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;

  const deals = React.useMemo(() => {
    if (!savedDeals) return [];
    
    // Case 1: Array of deals directly
    if (Array.isArray(savedDeals)) return savedDeals;
    
    // Case 2: { bookmarks: [ { dealId: {...} }, ... ] }
    if (savedDeals.bookmarks && Array.isArray(savedDeals.bookmarks)) {
      return savedDeals.bookmarks.map(b => ({
        ...(b.dealId || {}),
        _bookmarkId: b._id,
        isSaved: true
      })).filter(d => d._id || d.id);
    }
    
    // Case 3: { deals: [...] }
    if (savedDeals.deals && Array.isArray(savedDeals.deals)) return savedDeals.deals;
    
    return [];
  }, [savedDeals]);

  const totalPages = Math.ceil(deals.length / itemsPerPage);
  const paginatedDeals = deals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loader label="Accessing your private library..." /></div>;

  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-400 font-bold mb-4">Connection to library failed</p>
      <Button onClick={() => window.location.reload()} className="bg-[#01F27B] text-black font-black px-8 rounded-xl">Retry Sync</Button>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-4 h-4 text-[#01F27B]" />
            <span className="text-[10px] font-black text-[#01F27B] uppercase tracking-[0.3em]">Personal Library</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            Bookmarked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#01F27B] to-[#00d66d]">Opportunities</span>
          </h1>
          <p className="text-white/40 text-sm lg:text-base font-medium tracking-wide">
            Your curated selection of high-potential ventures and startups.
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/dashboard/investor/deals')}
          variant="outline" 
          className="bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold h-12 rounded-xl px-6 flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Explore Market
        </Button>
      </div>

      {deals.length === 0 ? (
        <Card className="bg-white/[0.02] border-white/5 border-dashed p-16 text-center max-w-2xl mx-auto rounded-[2.5rem]">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-10 h-10 text-white/10" />
          </div>
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-3">Library Empty</h3>
          <p className="text-white/40 mb-8 max-w-sm mx-auto font-medium leading-relaxed">
            You haven't bookmarked any deals yet. Start exploring the market to curate your next big investment.
          </p>
          <Button 
            onClick={() => navigate('/dashboard/investor/deals')}
            className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black px-10 h-14 rounded-2xl shadow-[0_0_20px_rgba(1,242,123,0.3)] transition-all"
          >
            Find Opportunities
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 min-h-[400px] content-start">
            {paginatedDeals.map((deal) => (
              <ExploreDealCard key={deal._id || deal.id} deal={deal} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-6 py-12 border-t border-white/5 mt-12">
              <div className="flex items-center gap-3 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
                <Button
                  variant="ghost"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => prev - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-white/40 hover:text-[#01F27B] disabled:opacity-10 transition-all font-black uppercase text-[10px] tracking-[0.2em] px-5 h-10 rounded-xl hover:bg-[#01F27B]/10 group/prev"
                >
                  <div className="flex items-center gap-2">
                    <span className="group-hover/prev:-translate-x-1 transition-transform">←</span>
                    <span>Back</span>
                  </div>
                </Button>
                
                <div className="h-6 w-px bg-white/10 mx-2" />

                <div className="flex items-center gap-4 px-4">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="relative group/page flex items-center justify-center"
                      >
                        {isActive && (
                          <div className="absolute inset-0 bg-[#01F27B] blur-[10px] rounded-full opacity-40 animate-pulse" />
                        )}
                        <div className={`
                          relative w-2.5 h-2.5 rounded-full transition-all duration-500
                          ${isActive ? 'bg-[#01F27B] scale-125' : 'bg-white/20 group-hover/page:bg-white/40 group-hover/page:scale-110'}
                        `} />
                        <span className={`
                          absolute -top-8 text-[9px] font-black tracking-widest transition-all duration-300
                          ${isActive ? 'text-[#01F27B] opacity-100' : 'text-white/20 opacity-0 group-hover/page:opacity-100'}
                        `}>
                          0{pageNum}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="h-6 w-px bg-white/10 mx-2" />

                <Button
                  variant="ghost"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => prev + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-white/40 hover:text-[#01F27B] disabled:opacity-10 transition-all font-black uppercase text-[10px] tracking-[0.2em] px-5 h-10 rounded-xl hover:bg-[#01F27B]/10 group/next"
                >
                  <div className="flex items-center gap-2">
                    <span>Next</span>
                    <span className="group-hover/next:translate-x-1 transition-transform">→</span>
                  </div>
                </Button>
              </div>
              
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                Viewing page <span className="text-white/40">{currentPage}</span> of <span className="text-white/40">{totalPages}</span>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
