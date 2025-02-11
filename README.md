# Formulary Placement AI Bot

## Overview
This project is a **FastAPI-based AI Bot** that allows pharmaceutical companies to search for their **contracted formulary data** from **OpenSearch**. The bot processes user queries, sends them to an **AI Gateway** for interpretation, and retrieves relevant data from OpenSearch.

### Key Features
- **FastAPI-based REST API** for handling user queries.
- **Supports AWS Lambda Deployment** via `mangum`.
- **Local Mode Support** using a JSON file (`local_data.json`).
- **Integrates with OpenSearch** for real-time data retrieval.
- **Uses an AI Gateway** to process natural language queries.

## Architecture
1. User sends a question (e.g., `"What is the WAC amount for PHG - Packers?"`).
2. API calls the **AI Gateway** to extract structured query details.
3. API queries **OpenSearch** (or local JSON in development mode).
4. API returns the relevant response to the user.

## Installation & Setup
### Prerequisites
- Python 3.8+
- OpenSearch instance (for production mode)
- AI Gateway endpoint

### Install Dependencies
```sh
pip install -r requirements.txt
```

### Running Locally
To run in local mode with JSON data:
```sh
LOCAL_MODE=True uvicorn main:app --reload
```
Access API at: **http://127.0.0.1:8000/ask**

#### Sample Request (POST /ask)
```json
{
  "query": "What is the WAC amount for PHG - Packers?"
}
```

### Running in Production (AWS Lambda)
1. Package dependencies:
   ```sh
   mkdir package
   pip install -r requirements.txt -t package
   cd package
   zip -r ../lambda.zip .
   cd ..
   zip -g lambda.zip main.py
   ```
2. Upload `lambda.zip` to AWS Lambda.
3. Set the Lambda **Handler** to `main.handler`.
4. Configure **API Gateway** to expose the endpoint.
5. Set environment variables in AWS Lambda:
   ```
   LOCAL_MODE=False
   AI_GATEWAY_URL=https://your-ai-gateway/api/query
   OPENSEARCH_HOST=your-opensearch-endpoint
   OPENSEARCH_PORT=9200
   OPENSEARCH_INDEX=fps_um
   ```

## Project Structure
```
|-- main.py             # FastAPI application
|-- requirements.txt    # Dependencies
|-- local_data.json     # Sample JSON data for local mode
|-- README.md           # Documentation
```

## Next Steps
- **Enhance AI Gateway Integration** for better natural language processing.
- **Improve Error Handling & Logging** for better debugging.
- **Optimize OpenSearch Queries** for faster responses.
- **Add Authentication** for secured access.

## Contributing
Pull requests are welcome! Please open an issue to discuss before making major changes.

## License
MIT License

---
### Need Help?
Feel free to reach out if you need help deploying or customizing this project! 🚀

