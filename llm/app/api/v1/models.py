from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class CategorizeRequest(BaseModel):
    data: Dict[Any, Any] | List[Dict[Any, Any]] | str

class ExpenseCategory(str, Enum):
    FOOD = "food"
    TRANSPORT = "transport" 
    HOUSING = "housing"
    UTILITIES = "utilities"
    ENTERTAINMENT = "entertainment"
    HEALTHCARE = "healthcare"
    SHOPPING = "shopping"
    EDUCATION = "education"
    TRAVEL = "travel"
    OTHER = "other"
    TRANSFER = "transfer"

class ExpenseItem(BaseModel):
    """
    Represents an individual expense/transfer entry
    """
    # description: str = Field(description="Description of the expense")
    amount: float = Field(description="Amount spent in Chilean pesos",gt=0)
    title: str = Field(description="Title of the item")
    category: ExpenseCategory = Field(description="Category of the expense")
    date: Optional[datetime] = Field(default=None, description="Date when the expense occurred")
    # payment_method: Optional[str] = Field(default=None, description="Method of payment used (cash, credit card, debit card, etc.)")

class ExpensedItems(BaseModel):
    """
    Represents a list of expensed/transfered items
    """
    expensed_items: List[ExpenseItem] = Field(
        description="List of all individual expense items"
    )


class EmbeddingRequest(BaseModel):
    texts: List[str]

class EmbeddingResponse(BaseModel):
    embeddings: List[List[float]]