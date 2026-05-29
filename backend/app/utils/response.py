from typing import Any, Optional

def success_response(data: Any = None, message: str = "Success") -> dict:
    return {"status": "success", "message": message, "data": data}

def error_response(message: str = "An error occurred", detail: Optional[Any] = None) -> dict:
    return {"status": "error", "message": message, "detail": detail}
