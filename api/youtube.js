import https from 'https';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  if (!process.env.YOUTUBE_API_KEY) {
    return res.status(500).json({ error: 'YouTube API key not configured' });
  }

  try {
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.append('part', 'snippet');
    searchUrl.searchParams.append('q', query);
    searchUrl.searchParams.append('type', 'video');
    searchUrl.searchParams.append('maxResults', '3');
    searchUrl.searchParams.append('safeSearch', 'strict');
    searchUrl.searchParams.append('order', 'relevance');
    searchUrl.searchParams.append('key', process.env.YOUTUBE_API_KEY);

    const data = await new Promise((resolve, reject) => {
      https.get(searchUrl.toString(), (response) => {
        let responseData = '';
        
        response.on('data', (chunk) => {
          responseData += chunk;
        });
        
        response.on('end', () => {
          if (response.statusCode !== 200) {
            reject(new Error(`YouTube API error: ${response.statusCode} ${responseData}`));
            return;
          }
          
          try {
            resolve(JSON.parse(responseData));
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        });
      }).on('error', (error) => {
        reject(error);
      });
    });
    
    const videos = data.items?.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
    })) || [];

    res.status(200).json({ videos });
  } catch (error) {
    console.error('YouTube API error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to search videos',
      details: error.message || 'Unknown error',
    });
  }
}

