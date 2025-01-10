'use client'

import { useState, useEffect } from 'react'
import TrendingItem from './TrendingItem'
import { Button } from "./ui/button"

interface Repository {
  id: string;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string;
  owner: {
    login: string;
  };
  forks_count: number;
  created_at: string;
}

interface TrendingListProps {
  viewMode: 'grid' | 'list';
}

export default function TrendingList({ viewMode }: TrendingListProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingRepositories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/github/trending');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from API');
      }
      setRepositories(data);
    } catch (error) {
      console.error('Error fetching trending repositories:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingRepositories();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-zinc-400">Loading trending repositories...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={fetchTrendingRepositories}>Retry</Button>
      </div>
    );
  }

  if (repositories.length === 0) {
    return <div className="text-center py-8 text-zinc-400">No trending repositories found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {repositories.map((repo) => (
        <TrendingItem key={repo.id} repository={repo} viewMode={viewMode} />
      ))}
    </div>
  );
}

