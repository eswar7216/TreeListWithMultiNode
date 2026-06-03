{
  "openapi": "3.1.0",
  "info": {
    "title": "SOX-Controlled Data Fix Agent",
    "version": "0.1.0"
  },
  "paths": {
    "/health": {
      "get": {
        "summary": "Health",
        "operationId": "health_health_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {}
              }
            }
          }
        }
      }
    },
    "/datafix/process": {
      "post": {
        "summary": "Process Ticket",
        "operationId": "process_ticket_datafix_process_post",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ProcessTicketRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {}
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/datafix/process-local": {
      "post": {
        "summary": "Process Local File",
        "operationId": "process_local_file_datafix_process_local_post",
        "parameters": [
          {
            "name": "ticket_number",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Ticket Number"
            }
          },
          {
            "name": "data_fix_type",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string",
              "default": "NDC_LIST_FIX",
              "title": "Data Fix Type"
            }
          },
          {
            "name": "ndc_list_id",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Ndc List Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "$ref": "#/components/schemas/Body_process_local_file_datafix_process_local_post"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {}
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/datafix/{ticket_number}/package": {
      "get": {
        "summary": "Get Package",
        "operationId": "get_package_datafix__ticket_number__package_get",
        "parameters": [
          {
            "name": "ticket_number",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Ticket Number"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {}
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/datafix/{ticket_number}/sql": {
      "get": {
        "summary": "Get Sql Package",
        "operationId": "get_sql_package_datafix__ticket_number__sql_get",
        "parameters": [
          {
            "name": "ticket_number",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Ticket Number"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {}
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/datafix/{ticket_number}/approval-summary": {
      "get": {
        "summary": "Get Approval Summary",
        "operationId": "get_approval_summary_datafix__ticket_number__approval_summary_get",
        "parameters": [
          {
            "name": "ticket_number",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Ticket Number"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {}
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/datafix/approval": {
      "post": {
        "summary": "Approve",
        "operationId": "approve_datafix_approval_post",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ApprovalRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApprovalRecord"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/datafix/{ticket_number}/audit": {
      "get": {
        "summary": "Get Audit",
        "operationId": "get_audit_datafix__ticket_number__audit_get",
        "parameters": [
          {
            "name": "ticket_number",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Ticket Number"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {}
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "ApprovalDecision": {
        "type": "string",
        "enum": [
          "APPROVED",
          "REJECTED",
          "NEEDS_CHANGES"
        ],
        "title": "ApprovalDecision"
      },
      "ApprovalRecord": {
        "properties": {
          "ticket_number": {
            "type": "string",
            "title": "Ticket Number"
          },
          "role": {
            "$ref": "#/components/schemas/ApprovalRole"
          },
          "approver_id": {
            "type": "string",
            "title": "Approver Id"
          },
          "decision": {
            "$ref": "#/components/schemas/ApprovalDecision"
          },
          "comments": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Comments"
          },
          "decision_ts": {
            "type": "string",
            "format": "date-time",
            "title": "Decision Ts"
          }
        },
        "type": "object",
        "required": [
          "ticket_number",
          "role",
          "approver_id",
          "decision"
        ],
        "title": "ApprovalRecord"
      },
      "ApprovalRequest": {
        "properties": {
          "ticket_number": {
            "type": "string",
            "title": "Ticket Number"
          },
          "role": {
            "$ref": "#/components/schemas/ApprovalRole"
          },
          "approver_id": {
            "type": "string",
            "title": "Approver Id"
          },
          "decision": {
            "$ref": "#/components/schemas/ApprovalDecision"
          },
          "comments": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Comments"
          }
        },
        "type": "object",
        "required": [
          "ticket_number",
          "role",
          "approver_id",
          "decision"
        ],
        "title": "ApprovalRequest"
      },
      "ApprovalRole": {
        "type": "string",
        "enum": [
          "SUPPORT",
          "DEV",
          "BPO"
        ],
        "title": "ApprovalRole"
      },
      "Body_process_local_file_datafix_process_local_post": {
        "properties": {
          "file": {
            "type": "string",
            "format": "binary",
            "title": "File"
          }
        },
        "type": "object",
        "required": [
          "file"
        ],
        "title": "Body_process_local_file_datafix_process_local_post"
      },
      "HTTPValidationError": {
        "properties": {
          "detail": {
            "items": {
              "$ref": "#/components/schemas/ValidationError"
            },
            "type": "array",
            "title": "Detail"
          }
        },
        "type": "object",
        "title": "HTTPValidationError"
      },
      "ProcessTicketRequest": {
        "properties": {
          "ticket_number": {
            "type": "string",
            "title": "Ticket Number"
          }
        },
        "type": "object",
        "required": [
          "ticket_number"
        ],
        "title": "ProcessTicketRequest"
      },
      "ValidationError": {
        "properties": {
          "loc": {
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "type": "array",
            "title": "Location"
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        },
        "type": "object",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "title": "ValidationError"
      }
    }
  }
}
