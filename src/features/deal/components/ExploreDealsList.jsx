import React, { useState, useEffect } from "react";
import ExploreDealCard from "./ExploreDealCard";
import { resolveDealList } from "../utils/dealUtils";
import api from "@/lib/api";
import { AlertCircle, Compass } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Loader } from "@/shared/ui";

export default function ExploreDealsList() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalDeals, setTotalDeals] = useState(0);
  const limit = 6; // Set back to 6 as requested

  // Updating fetchDeals to set totalDeals
  const fetchDealsWithTotal = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/v1/deals/feed?page=${pageNum}&limit=${limit}`);
      const rawData = response?.data || response;
      
      // Handle different response shapes
      let newDeals = [];
      let total = 0;
      
      if (Array.isArray(rawData)) {
        newDeals = rawData;
        total = rawData.length;
      } else {
        newDeals = resolveDealList(rawData);
        // Correctly extract total from nested pagination or top-level properties
        total = rawData?.pagination?.total || rawData?.total || response?.data?.total || response?.total || newDeals.length;
      }
      
      setDeals(newDeals);
      setTotalDeals(total);
      setPage(pageNum);
    } catch (err) {
      setError(err.message || "Failed to load deals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealsWithTotal(1);
  }, []);

  const totalPagesCount = Math.ceil(totalDeals / limit);

  if (loading && page === 1) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Explore Deals</h1>
          <p className="text-white/60 mt-1">Discover and invest in high-growth startups.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#0c0c0c] border border-white/5 rounded-xl h-[420px] p-6 animate-pulse flex flex-col">
              <div className="flex justify-between items-start mb-5">
                <div className="w-14 h-14 bg-white/10 rounded-xl" />
                <div className="w-20 h-6 bg-white/10 rounded-md" />
              </div>
              <div className="w-3/4 h-6 bg-white/10 rounded mb-2" />
              <div className="w-1/2 h-4 bg-white/5 rounded mb-auto" />
              <div className="w-full h-10 bg-white/5 rounded-lg mt-6" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase italic">Explore <span className="text-[#01F27B]">Market</span></h1>
        <p className="text-white/40 mt-1 font-medium italic">Discover and invest in high-growth startups.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 overflow-hidden">
        {deals.map((deal, idx) => (
          <div key={deal.id || deal._id || idx} className="scrollbar-none overflow-hidden h-full">
            <ExploreDealCard deal={deal} />
          </div>
        ))}
      </div>

      {deals.length > 0 && (
        <div className="flex flex-col items-center gap-6 py-12 border-t border-white/5 mt-12">
          <div className="flex items-center gap-3 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
            <Button
              variant="ghost"
              disabled={page === 1 || loading}
              onClick={() => {
                fetchDealsWithTotal(page - 1);
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
              {[...Array(Math.max(1, totalPagesCount))].map((_, i) => {
                const pageNum = i + 1;
                const isActive = page === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      if (isActive) return;
                      fetchDealsWithTotal(pageNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={loading || totalPagesCount <= 1}
                    className="relative group/page flex items-center justify-center disabled:cursor-default"
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-[#01F27B] blur-[10px] rounded-full opacity-40 animate-pulse" />
                    )}
                    <div className={`
                      relative w-2.5 h-2.5 rounded-full transition-all duration-500
                      ${isActive ? 'bg-[#01F27B] scale-125' : 'bg-white/20 group-hover/page:bg-white/40 group-hover/page:scale-110'}
                      ${totalPagesCount <= 1 && !isActive ? 'opacity-20' : ''}
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
              disabled={page === totalPagesCount || totalPagesCount <= 1 || loading}
              onClick={() => {
                fetchDealsWithTotal(page + 1);
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
            Viewing page <span className="text-white/40">{page}</span> of <span className="text-white/40">{Math.max(1, totalPagesCount)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
