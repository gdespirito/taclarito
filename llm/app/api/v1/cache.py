import os
import json
import psycopg2

CACHE_INTERVAL = "1 day"

def get_cached_results(query, database='wrapped_cache'):
    query_str = f"""
        SELECT results 
        FROM {database}
        WHERE query = %s 
        AND created_at > NOW() - INTERVAL %s
        ORDER BY created_at DESC
        LIMIT 1
    """
    with psycopg2.connect(os.environ["DB_CONNECTION_STRING"]) as conn:
        with conn.cursor() as cur:
            cur.execute(query_str, (query, CACHE_INTERVAL))
            cached_result = cur.fetchone()
            if cached_result:
                return cached_result[0]
            return None

def cache_results(query, results, database='wrapped_cache'):
    query_str = f"""INSERT INTO {database} (query, results) VALUES (%s, %s) ON CONFLICT (query) DO UPDATE SET results = EXCLUDED.results, created_at = CURRENT_TIMESTAMP"""
    with psycopg2.connect(os.environ["DB_CONNECTION_STRING"]) as conn:
        with conn.cursor() as cur:
            cur.execute(query_str, (query, json.dumps(results)))
            

def log_results(query, results):
    with psycopg2.connect(os.environ["DB_CONNECTION_STRING"]) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO query_log (query, results) VALUES (%s, %s)""",
                (query, json.dumps(results))
            )