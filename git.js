### **Updated Node.js API to Fetch Git Metrics**
This implementation now fully supports:
1. **Total number of commits**  
2. **Total number of PRs**  
3. **Total number of comments**  
4. **Total contributions (sum of commits, PRs, and comments)**  
5. **All PRs opened by the user**  
6. **All PRs the user contributed to**  
7. **All PRs the user commented on**  

---

## **1. GitHub API Endpoints Used**
- **Commits**: `/search/commits?q=author:{username}+committer-date:{from}..{to}`
- **PRs opened**: `/search/issues?q=type:pr+author:{username}+created:{from}..{to}`
- **PRs contributed to**: `/search/issues?q=type:pr+involves:{username}+created:{from}..{to}`
- **PRs commented on**: `/search/issues?q=type:pr+commenter:{username}+created:{from}..{to}`

---

## **2. `server.js` - Complete Implementation**
```javascript
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const moment = require('moment');

const app = express();
app.use(cors());
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_HEADERS = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.cloak-preview' // Required for Search Commits API
};

// Default time range: Last 3 months (maximum: 12 months)
const DEFAULT_FROM_DATE = moment().subtract(3, 'months').format('YYYY-MM-DD');
const MAX_FROM_DATE = moment().subtract(12, 'months').format('YYYY-MM-DD');

/**
 * Fetch GitHub metrics for a developer with optional date range
 */
app.get('/developer/:username/git-metrics', async (req, res) => {
    const username = req.params.username;

    // Get custom date range from query params
    let fromDate = req.query.from || DEFAULT_FROM_DATE;
    let toDate = req.query.to || moment().format('YYYY-MM-DD');

    // Ensure the fromDate is within the last 12 months
    if (moment(fromDate).isBefore(MAX_FROM_DATE)) {
        fromDate = MAX_FROM_DATE;
    }

    try {
        const [commits, prsOpened, prsContributed, prComments] = await Promise.all([
            getUserCommits(username, fromDate, toDate),
            getUserPROpened(username, fromDate, toDate),
            getUserPRContributions(username, fromDate, toDate),
            getUserPRComments(username, fromDate, toDate),
        ]);

        res.json({
            totalCommits: commits.length,
            totalPRs: prsOpened.length,
            totalComments: prComments.length,
            totalContributions: commits.length + prsOpened.length + prComments.length,
            prOpenedDetails: prsOpened,
            prContributedDetails: prsContributed,
            prCommentedDetails: prComments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch GitHub metrics' });
    }
});

/**
 * Get total commits in all repositories a user has contributed to (by date range)
 */
async function getUserCommits(username, fromDate, toDate) {
    try {
        const url = `https://api.github.com/search/commits?q=author:${username}+committer-date:${fromDate}..${toDate}`;
        const response = await axios.get(url, { headers: GITHUB_HEADERS });

        return response.data.items.map(commit => ({
            sha: commit.sha,
            message: commit.commit.message,
            url: commit.html_url,
            date: commit.commit.committer.date,
            repo: commit.repository.full_name
        }));
    } catch (error) {
        console.error(`Error fetching commits for ${username}:`, error.message);
        return [];
    }
}

/**
 * Get all PRs opened by a user within a date range
 */
async function getUserPROpened(username, fromDate, toDate) {
    try {
        const url = `https://api.github.com/search/issues?q=type:pr+author:${username}+created:${fromDate}..${toDate}`;
        const response = await axios.get(url, { headers: GITHUB_HEADERS });

        return response.data.items.map(pr => ({
            repo: pr.repository_url.replace('https://api.github.com/repos/', ''),
            title: pr.title,
            url: pr.html_url,
            state: pr.state,
            created_at: pr.created_at
        }));
    } catch (error) {
        console.error(`Error fetching PRs opened by ${username}:`, error.message);
        return [];
    }
}

/**
 * Get all PRs a user contributed to within a date range
 */
async function getUserPRContributions(username, fromDate, toDate) {
    try {
        const url = `https://api.github.com/search/issues?q=type:pr+involves:${username}+created:${fromDate}..${toDate}`;
        const response = await axios.get(url, { headers: GITHUB_HEADERS });

        return response.data.items.map(pr => ({
            repo: pr.repository_url.replace('https://api.github.com/repos/', ''),
            title: pr.title,
            url: pr.html_url,
            state: pr.state,
            created_at: pr.created_at
        }));
    } catch (error) {
        console.error(`Error fetching PRs contributed by ${username}:`, error.message);
        return [];
    }
}

/**
 * Get all PRs a user has commented on within a date range
 */
async function getUserPRComments(username, fromDate, toDate) {
    try {
        const url = `https://api.github.com/search/issues?q=type:pr+commenter:${username}+created:${fromDate}..${toDate}`;
        const response = await axios.get(url, { headers: GITHUB_HEADERS });

        return response.data.items.map(pr => ({
            repo: pr.repository_url.replace('https://api.github.com/repos/', ''),
            title: pr.title,
            url: pr.html_url,
            state: pr.state,
            created_at: pr.created_at
        }));
    } catch (error) {
        console.error(`Error fetching PRs commented on by ${username}:`, error.message);
        return [];
    }
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## **3. Example API Requests**
### **Default (Last 3 Months)**
```bash
GET http://localhost:5000/developer/octocat/git-metrics
```

### **Custom Date Range (Last 6 Months)**
```bash
GET http://localhost:5000/developer/octocat/git-metrics?from=2023-09-01&to=2024-03-01
```

### **Only Last Month**
```bash
GET http://localhost:5000/developer/octocat/git-metrics?from=2024-02-01&to=2024-03-01
```

---

## **4. Example API Response**
```json
{
  "totalCommits": 42,
  "totalPRs": 15,
  "totalComments": 20,
  "totalContributions": 77,
  "prOpenedDetails": [
    {
      "repo": "org/repo1",
      "title": "Fix API performance",
      "url": "https://github.com/org/repo1/pull/123",
      "state": "merged",
      "created_at": "2024-02-10T15:30:00Z"
    }
  ],
  "prContributedDetails": [
    {
      "repo": "org/repo2",
      "title": "Refactored authentication logic",
      "url": "https://github.com/org/repo2/pull/50",
      "state": "open",
      "created_at": "2024-01-20T12:15:00Z"
    }
  ],
  "prCommentedDetails": [
    {
      "repo": "org/repo3",
      "title": "Fix security issue",
      "url": "https://github.com/org/repo3/pull/78",
      "state": "closed",
      "created_at": "2024-01-25T10:15:00Z"
    }
  ]
}
```

---

### **Next Steps**
- **Pagination Handling** (GitHub API paginates search results).
- **Database Storage** (Cache data to avoid rate limits).
- **Frontend Dashboard** (React UI to visualize metrics).

Would you like **pagination or database caching next?** 🚀
