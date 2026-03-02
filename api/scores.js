const DATAGOLF_API_KEY = '056c1ba85bc2baccaf576c1c8385';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // Fetch live tournament data from DataGolf
        const response = await fetch(
            `https://feeds.datagolf.com/preds/live-tournament-stats?tour=pga&file_format=json&key=${DATAGOLF_API_KEY}`,
            { headers: { 'User-Agent': 'Mozilla/5.0' } }
        );
        
        if (!response.ok) {
            throw new Error(`DataGolf API error: ${response.status}`);
        }

        const data = await response.json();
        const scores = {};

        // Extract player scores from DataGolf response
        if (data && data.live_stats) {
            for (const player of data.live_stats) {
                const name = player.player_name;
                const score = player.total_to_par || 0;
                scores[name] = score;
            }
        }

        res.status(200).json({ scores, source: 'DataGolf' });
    } catch (err) {
        console.error('DataGolf fetch error:', err);
        res.status(500).json({ error: err.message });
    }
}
