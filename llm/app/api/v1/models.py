from typing import Optional, List, Union, Dict
from pydantic import BaseModel, Field
import datetime
from enum import Enum

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class CategorizeRequestRow(BaseModel):
    id: Union[str, int] = Field(description="Id")
    amount: int = Field(description="Amount spent")
    description: str = Field(descriptiodn="Description of the Item")
    date: Optional[datetime.date] = Field(default=None, description="Date when the expense occurred")

class CategorizeResponseRow(BaseModel):
    id: Union[str, int] = Field(description="Id")
    amount: int = Field(description="Amount spent")
    description: str = Field(description="Description of the Item")
    category: Optional[str] = Field(description="Category of the Item")
    date: Optional[datetime.date] = Field(default=None, description="Date when the expense occurred")

class CategorizeRequest(BaseModel):
    data: List[CategorizeRequestRow]

class CategorizeResponse(BaseModel):
    data: List[CategorizeResponseRow]


class ExpenseCategoryWrapped(str, Enum):
    FOOD = "food"
    UTILITIES = "utilities"
    ENTERTAINMENT = "entertainment"
    HEALTHCARE = "healthcare"
    EDUCATION = "education"
    TRAVEL = "travel"
    STREAMING_SUBSCRIPTIONS = "streaming_subscriptions"
    LIQUOR = "liquor"
    SPORT = "sport"
    DELIVERY = "delivery"
    MERCADOLIBRE = "mercadolibre"
    SHEIN = "shein"
    ALIEXPRESS = "aliexpress"
    TRANSFER = "transfer"
    SHOPPING = "shopping"
    OTHER = "other"

class ItemCategoriesWrapped(BaseModel):
    """
    Represents an individual expense/transfer entry
    """
    categories: List[ExpenseCategoryWrapped] = Field(description="List of categories for each item")

class ExpenseItemWrapped(BaseModel):
    """
    Represents an individual expense/transfer entry
    """
    amount: float = Field(description="Amount spent in Chilean pesos",gt=0)
    description: str = Field(descriptiodn="Description of the Item")
    category: ExpenseCategoryWrapped = Field(description="Category of the expense")
    date: Optional[datetime.date] = Field(default=None, description="Date when the expense occurred")


class ExpensedItemsWrapped(BaseModel):
    """
    Represents a list of expensed/transfered items
    """
    expensed_items: List[ExpenseItemWrapped] = Field(
        description="List of all individual expense items"
    )

class ExpenseCategory(str, Enum):
    TYPICAL_SERVICES_INTERNET = "Internet services"
    TYPICAL_SERVICES_PHONE = "Phone services"
    TYPICAL_SERVICES_ELECTRICITY = "Electricity"
    TYPICAL_SERVICES_GAS = "Gas"
    TYPICAL_SERVICES_WATER = "Water"
    TYPICAL_SERVICES_ALARM = "Alarm systems"
    TYPICAL_SERVICES_TV = "Television services"
    TYPICAL_SERVICES_OTHER = "Other typical services"
    LEISURE_TRANSPORT_RESTAURANTS = "Dining out"
    LEISURE_TRANSPORT_HOTEL = "Hotels"
    LEISURE_TRANSPORT_TRANSPORT = "Public transportation"
    LEISURE_TRANSPORT_RENTAL_CAR = "Car rentals"
    LEISURE_TRANSPORT_SHOWS = "Shows and events"
    LEISURE_TRANSPORT_GASOLINE = "Gasoline"
    LEISURE_TRANSPORT_PARKING = "Parking"
    LEISURE_TRANSPORT_TOLLS = "Toll fees"
    LEISURE_TRANSPORT_LOTTERIES = "Lotteries"
    LEISURE_TRANSPORT_OTHER = "Other leisure and transport expenses"
    HEALTH_EDUCATION_SPORTS_PHARMACY = "Pharmacy"
    HEALTH_EDUCATION_SPORTS_BEAUTY = "Beauty services"
    HEALTH_EDUCATION_SPORTS_OPTICAL = "Optical services"
    HEALTH_EDUCATION_SPORTS_DOCTOR = "Medical services"
    HEALTH_EDUCATION_SPORTS_SPORTS = "Sports activities"
    HEALTH_EDUCATION_SPORTS_STUDIES = "Educational expenses"
    HEALTH_EDUCATION_SPORTS_ASSOCIATIONS = "Associations"
    HEALTH_EDUCATION_SPORTS_CHARITY = "Charitable donations"
    HEALTH_EDUCATION_SPORTS_OTHER = "Other health, education, and sports expenses"
    HOUSING_VEHICLE_RENT = "Rent"
    HOUSING_VEHICLE_COMMUNITY = "Community fees"
    HOUSING_VEHICLE_DOMESTIC_SERVICE = "Domestic services"
    HOUSING_VEHICLE_HOME_MAINTENANCE = "Home maintenance"
    HOUSING_VEHICLE_VEHICLE_MAINTENANCE = "Vehicle maintenance"
    HOUSING_VEHICLE_VEHICLE_PURCHASE = "Vehicle purchase"
    HOUSING_VEHICLE_OTHER = "Other housing and vehicle expenses"
    INSURANCE_AUTO = "Car insurance"
    INSURANCE_MOTORCYCLE = "Motorcycle insurance"
    INSURANCE_HOME = "Home insurance"
    INSURANCE_HEALTH = "Health insurance"
    INSURANCE_LIFE = "Life insurance"
    INSURANCE_TRAVEL = "Travel insurance"
    INSURANCE_PETS = "Pet insurance"
    INSURANCE_OTHER = "Other insurance"
    SHOPPING_HOME = "Home goods"
    SHOPPING_ELECTRONICS = "Electronics"
    SHOPPING_SUPERMARKET = "Supermarket"
    SHOPPING_CLOTHING = "Clothing"
    SHOPPING_SPORTS = "Sports gear"
    SHOPPING_BOOKSTORE = "Books and stationery"
    SHOPPING_KIDS = "Kids' items"
    SHOPPING_GIFTS = "Gifts"
    SHOPPING_OTHER = "Other shopping expenses"
    BANKS_GOV_AGENCIES_MORTGAGE = "Mortgage payments"
    BANKS_GOV_AGENCIES_LOANS = "Loan repayments"
    BANKS_GOV_AGENCIES_BANK_FEES = "Bank charges"
    BANKS_GOV_AGENCIES_TAXES = "Taxes"
    BANKS_GOV_AGENCIES_CITY_HALL = "Municipal fees"
    BANKS_GOV_AGENCIES_SOCIAL_SECURITY = "Social security payments"
    BANKS_GOV_AGENCIES_FINES = "Fines"
    BANKS_GOV_AGENCIES_CONSULTANTS = "Consultancy services"
    BANKS_GOV_AGENCIES_OTHER = "Other banking and governmental expenses"


class ItemCategories(BaseModel):
    """
    Represents an individual expense/transfer entry
    """
    categories: List[ExpenseCategory] = Field(description="List of categories for each item")

class ExpenseItem(BaseModel):
    """
    Represents an individual expense/transfer entry
    """
    amount: float = Field(description="Amount spent in Chilean pesos",gt=0)
    description: str = Field(descriptiodn="Description of the Item")
    category: ExpenseCategory = Field(description="Category of the expense")
    date: Optional[datetime.date] = Field(default=None, description="Date when the expense occurred")

class ExpensedItems(BaseModel):
    """
    Represents a list of expensed/transfered items
    """
    expensed_items: List[ExpenseItem] = Field(
        description="List of all individual expense items"
    )

class Roast(BaseModel):
    """
    Represents a comment to someone's expense habits, can be a roast or a simple advice 
    """
    comment: str = Field(description="Roast or advice of the user's expense habits")


class RoastRequest(BaseModel):
    expensed_items: List[ExpenseItemWrapped] = Field(description="List of all individual expense items")

class RoastResponse(BaseModel):
    """
    Represents a list of roasts of someone's expense habits
    """
    roasts: Dict[ExpenseCategoryWrapped, str] = Field(description="Roast of the user's expense habits by category")

class EmbeddingRequest(BaseModel):
    texts: List[str]

class EmbeddingResponse(BaseModel):
    embeddings: List[List[float]]
