Since a GitHub user can contribute to multiple repositories (not just their own), we need a more advanced approach to track **all repositories** where the user has contributed.

---

### **Solution Approach**
1. **Fetch Public Events:**  
   - Use `https://api.github.com/users/{username}/events`  
   - This API returns all recent actions by a user (commits, PRs, issues, etc.).
   - We filter `PushEvent` for commits and `PullRequestEvent` for PRs.

2. **Fetch PR Comments Separately:**  
   - Use `https://api.github.com/search/issues?q=commenter:{username}+type:pr`

---

## **Updated `server.js` Code**

```javascript
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const HIERARCHY_API_URL = process.env.HIERARCHY_API_URL;
const GITHUB_HEADERS = {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
};

/**
 * Fetch leader-reportee hierarchy
 */
app.get('/hierarchy', async (req, res) => {
    try {
        const response = await axios.get(HIERARCHY_API_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hierarchy' });
    }
});

/**
 * Fetch GitHub metrics for a developer (commits, PRs, PR comments)
 */
app.get('/developer/:username/git-metrics', async (req, res) => {
    const username = req.params.username;

    try {
        const [commits, prs, prComments] = await Promise.all([
            getUserCommits(username),
            getUserPRs(username),
            getUserPRComments(username),
        ]);

        res.json({
            totalCommits: commits.totalCommits,
            totalPRs: prs.length,
            totalPRComments: prComments.length,
            prDetails: prs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch GitHub metrics' });
    }
});

/**
 * Get total commits from all repositories a user has contributed to
 */
async function getUserCommits(username) {
    let totalCommits = 0;

    try {
        const eventsUrl = `https://api.github.com/users/${username}/events`;
        const response = await axios.get(eventsUrl, GITHUB_HEADERS);

        // Filter only PushEvents (commits)
        const pushEvents = response.data.filter(event => event.type === 'PushEvent');

        pushEvents.forEach(event => {
            totalCommits += event.payload.commits.length;
        });

        return { totalCommits };
    } catch (error) {
        console.error(`Error fetching commits for ${username}:`, error.message);
        return { totalCommits: 0 };
    }
}

/**
 * Get total PRs and details for a user
 */
async function getUserPRs(username) {
    try {
        const prsUrl = `https://api.github.com/search/issues?q=author:${username}+type:pr`;
        const response = await axios.get(prsUrl, GITHUB_HEADERS);

        return response.data.items.map(pr => ({
            repo: pr.repository_url.replace('https://api.github.com/repos/', ''),
            title: pr.title,
            url: pr.html_url,
            state: pr.state,
            created_at: pr.created_at,
        }));
    } catch (error) {
        console.error(`Error fetching PRs for ${username}:`, error.message);
        return [];
    }
}

/**
 * Get total PR comments by a user
 */
async function getUserPRComments(username) {
    try {
        const commentsUrl = `https://api.github.com/search/issues?q=commenter:${username}+type:pr`;
        const response = await axios.get(commentsUrl, GITHUB_HEADERS);

        return response.data.items;
    } catch (error) {
        console.error(`Error fetching PR comments for ${username}:`, error.message);
        return [];
    }
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## **How This Works**
### **Commits**
- Fetches all GitHub events of the user.
- Filters `PushEvent` and counts commits.

### **PRs**
- Uses GitHub’s **search API** to find all PRs authored by the user.

### **PR Comments**
- Uses GitHub’s **search API** to find PRs where the user has commented.

---

## **Example API Calls**
### Get Developer GitHub Metrics:
```
GET http://localhost:5000/developer/johndoe/git-metrics
```

### Sample Response:
```json
{
  "totalCommits": 42,
  "totalPRs": 10,
  "totalPRComments": 8,
  "prDetails": [
    {
      "repo": "org/repo1",
      "title": "Fix issue #123",
      "url": "https://github.com/org/repo1/pull/45",
      "state": "closed",
      "created_at": "2024-03-01T12:00:00Z"
    },
    {
      "repo": "org/repo2",
      "title": "New feature added",
      "url": "https://github.com/org/repo2/pull/23",
      "state": "open",
      "created_at": "2024-02-15T10:30:00Z"
    }
  ]
}
```

---

### **Next Steps**
- Cache results to **avoid GitHub rate limits** (e.g., store in Redis).
- Add a scheduler (`node-cron`) to update metrics **periodically**.
- Handle **pagination** for large datasets.

Let me know if you need **pagination, database storage, or a UI** next! 🚀
