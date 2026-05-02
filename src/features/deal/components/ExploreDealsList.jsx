import React, { useState, useEffect } from "react";
import ExploreDealCard from "./ExploreDealCard";
import { resolveDealList } from "../utils/dealUtils";
import api from "@/lib/api";
import { Loader2, AlertCircle, Compass } from "lucide-react";
import { Button } from "@/shared/ui/button";

export default function ExploreDealsList() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const limit = 9; // Grid of 3x3

  const fetchDeals = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      // Fetch data from GET /api/v1/deals/feed
      const response = await api.get(`/api/v1/deals/feed?page=${pageNum}&limit=${limit}`);
      
      const rawData = response?.data || response;
      const newDeals = resolveDealList(rawData);
      const total = response?.data?.total || 0;
      
      if (pageNum === 1) {
        setDeals(newDeals);
      } else {
        setDeals(prev => [...prev, ...newDeals]);
      }
      
      if (newDeals.length === limit || (pageNum * limit < total)) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err.message || "Failed to load deals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals(1);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDeals(nextPage);
  };

  // Skeleton Loader for initial loading state
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
              
              <div className="flex justify-between items-end mb-3 mt-6">
                <div className="w-1/3 h-6 bg-white/10 rounded" />
                <div className="w-1/4 h-5 bg-white/10 rounded" />
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full mb-6" />
              <div className="w-full h-10 bg-white/5 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && page === 1) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Failed to load deals</h3>
        <p className="text-white/60 mb-6">{error}</p>
        <Button onClick={() => fetchDeals(1)} className="bg-[#01F27B] text-black hover:bg-[#01F27B]/90 font-semibold">
          Try Again
        </Button>
      </div>
    );
  }

  if (!loading && deals.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[400px] text-center border border-dashed border-white/10 rounded-2xl bg-[#0c0c0c] p-8">
        <Compass className="w-12 h-12 text-white/20 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Deals Found</h3>
        <p className="text-white/60">There are currently no active deals to explore. Check back later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Explore Deals</h1>
        <p className="text-white/60 mt-1">Discover and invest in high-growth startups.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {deals.map((deal, idx) => (
          <ExploreDealCard key={deal.id || deal._id || idx} deal={deal} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            className="border-white/10 hover:bg-white/5 text-white"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Load More Deals
          </Button>
        </div>
      )}
    </div>
  );
}
