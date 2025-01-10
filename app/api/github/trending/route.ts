import { NextResponse } from 'next/server'

const GITHUB_API_URL = 'https://api.github.com/search/repositories';

export async function GET() {
  console.log('Starting /api/github/trending request');
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateString = sevenDaysAgo.toISOString().split('T')[0];

    const query = `created:>${dateString} sort:stars-desc`;
    const url = `${GITHUB_API_URL}?q=${encodeURIComponent(query)}&sort=stars&order=desc`;

    console.log('Fetching GitHub data from:', url);
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Hackeroso/1.0'
      }
    });

    if (!response.ok) {
      console.error(`GitHub API responded with status: ${response.status}`);
      return NextResponse.json({ error: `Failed to fetch from GitHub: ${response.status} ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    console.log(`Fetched ${data.items.length} repositories`);

    const repositories = data.items.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      full_name: item.full_name,
      html_url: item.html_url,
      description: item.description,
      stargazers_count: item.stargazers_count,
      language: item.language,
      owner: {
        login: item.owner.login,
      },
      forks_count: item.forks_count,
      created_at: item.created_at,
    }));

    return NextResponse.json(repositories);
  } catch (error) {
    console.error('Unexpected error in /api/github/trending:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' }, { status: 500 });
  }
}

