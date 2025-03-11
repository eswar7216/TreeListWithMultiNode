from fastapi import APIRouter
from services.ai_gateway import process_query, format_response_with_llm
from services.opensearch import query_opensearch
import logging
import pandas as pd
import os
from fastapi.responses import FileResponse

router = APIRouter()

# Function to generate reports asynchronously
async def generate_report(tool_calls):
    """Generates a report based on OpenSearch tool calls."""
    logging.info("Fetching data for report generation.")
    
    # Query OpenSearch for the requested report data
    results = await query_opensearch(tool_calls, history={})
    if not results or "error" in results[0]:
        return {"error": "No data available for report generation."}
    
    # Convert data to DataFrame
    df = pd.DataFrame(results)
    if df.empty:
        return {"error": "No valid records found."}
    
    # Define report file path
    report_path = "reports/formulary_report.csv"
    os.makedirs("reports", exist_ok=True)  # Ensure reports directory exists
    df.to_csv(report_path, index=False)
    
    logging.info(f"Report generated successfully: {report_path}")
    return FileResponse(report_path, media_type='text/csv', filename="formulary_report.csv")

@router.post("/chat/{conversation_id}")
async def ask_bot(conversation_id: str, request: dict):
    """Processes AI response and executes tool calls dynamically."""
    
    user_query = request.get("query")
    logging.info(f"Received query for conversation {conversation_id}: {user_query}")
    
    history = {}  # Assume conversation history is maintained somewhere
    history[conversation_id] = history.get(conversation_id, [])
    
    history[conversation_id].append({"role": "user", "content": user_query})
    ai_response = await process_query(user_query, history)
    
    logging.info(f"AI Gateway processed response: {ai_response}")
    history[conversation_id].append({"role": "assistant", "content": ai_response})

    if isinstance(ai_response, dict) and "query_category" in ai_response:
        query_category = ai_response["query_category"]
        
        if query_category == "report":
            logging.info("Generating report based on user query.")
            return await generate_report(ai_response["tool_calls"])
        
        elif query_category == "structured":
            logging.info("AI returned tool calls, executing OpenSearch queries.")
            results = await query_opensearch(ai_response["tool_calls"], history)
            return {"response": await format_response_with_llm(results, history)}
    
    logging.info("AI returned direct response.")
    return {"response": ai_response}
