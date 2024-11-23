import libsql_experimental as libsql
from dotenv import load_dotenv
import os
load_dotenv()

url = os.getenv("TURSO_DATABASE_URL")
auth_token = os.getenv("TURSO_AUTH_TOKEN")

def execute_db_command(command, params=None):


    conn = libsql.connect(database=url, auth_token=auth_token)
    #conn = libsql.connect('db.sqlite')
    cur = conn.cursor()
    try:
        results = cur.execute(command, params).fetchall()
        conn.commit()
        del cur
        return results
    except:
        print(command)
        raise


def safe_add_column(column_definition):
    try:
        execute_db_command(column_definition)
    except Exception as e:
        print(f"Column already exists: {e}")


def init_expense_tables():

    # Create users table
    create_users = """
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT
    )
    """
    
    # Create expense categories table
    create_categories = """
    CREATE TABLE IF NOT EXISTS expense_categories (
        category_id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_name TEXT NOT NULL UNIQUE
    )
    """
    
    # Create expensed items table
    create_expensed_items = """
    CREATE TABLE IF NOT EXISTS expensed_items (
        item_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount REAL NOT NULL CHECK (amount > 0),
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (category) REFERENCES expense_categories(category_name)
    )
    """

        # Embeddings
    create_embeddings = """
    CREATE TABLE IF NOT EXISTS embeddings (
        user_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL,
        full_emb F32_BLOB(1024), -- cohere
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES expensed_items(item_id) ON DELETE CASCADE
    )
    """
    
    # Create indexes
    create_user_index = """
    CREATE INDEX IF NOT EXISTS idx_expensed_items_user_id 
    ON expensed_items(user_id)
    """

    create_embedding_index = """
    CREATE INDEX IF NOT EXISTS embeddings_idx
    ON embeddings (libsql_vector_idx(full_emb))
    """
    
    create_date_index = """
    CREATE INDEX IF NOT EXISTS idx_expensed_items_date 
    ON expensed_items(date)
    """
    
    # Insert categories
    insert_categories = """
    INSERT OR IGNORE INTO expense_categories (category_name) VALUES (?)
    """
    
    categories = [
        'food',
        'transport',
        'housing',
        'utilities',
        'entertainment',
        'healthcare',
        'shopping',
        'education',
        'travel',
        'other',
        'transfer'
    ]
    
    try:
        # Create tables
        execute_db_command(create_users)
        execute_db_command(create_categories)
        execute_db_command(create_expensed_items)
        execute_db_command(create_embeddings)
        
        # Create indexes
        execute_db_command(create_user_index)
        execute_db_command(create_date_index)
        execute_db_command(create_embedding_index)
        
        # Insert categories one by one
        for category in categories:
            execute_db_command(insert_categories, (category,))
            
        print("Database schema created successfully!")
        
    except Exception as e:
        print(f"Error creating database schema: {e}")

# Function to add new columns safely if needed
def add_new_columns():
    columns_to_add = [
        # Add any new columns here if needed in the future
        # "ALTER TABLE expensed_items ADD COLUMN new_column TEXT"
    ]
    
    for column_def in columns_to_add:
        safe_add_column(column_def)

# Initialize everything
def initialize_database():
    init_expense_tables()
    add_new_columns()

# Run the initialization
if __name__ == "__main__":
    initialize_database()
