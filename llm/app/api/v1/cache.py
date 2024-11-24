import os
import json
import psycopg2

CACHE_INTERVAL = "1 day"

def get_cached_results(query, database='wrapped_cache'):
    with psycopg2.connect(os.environ["DB_CONNECTION_STRING"]) as conn:
        with conn.cursor() as cur:
            if database == 'wrapped_cache':
                cur.execute("""
                    SELECT results 
                    FROM wrapped_cache 
                    WHERE query = %s 
                    AND created_at > NOW() - INTERVAL %s
                    ORDER BY created_at DESC
                    LIMIT 1
                """, (query, CACHE_INTERVAL))
            else:
                cur.execute("""
                    SELECT results 
                    FROM categorize_cache 
                    WHERE query = %s 
                    AND created_at > NOW() - INTERVAL %s
                    ORDER BY created_at DESC
                    LIMIT 1
                """, (query, CACHE_INTERVAL))
            cached_result = cur.fetchone()
            if cached_result:
                return cached_result[0]
            return None

def cache_results(query, results, database='wrapped_cache'):
    with psycopg2.connect(os.environ["DB_CONNECTION_STRING"]) as conn:
        with conn.cursor() as cur:
            if database == 'wrapped_cache':
                cur.execute(
                    """INSERT INTO wrapped_cache (query, results) VALUES (%s, %s)
                    ON CONFLICT (query) DO UPDATE SET results = EXCLUDED.results, created_at = CURRENT_TIMESTAMP""",
                    (query, json.dumps(results))
                )
            else:
                cur.execute(
                    """INSERT INTO categorize_cache (query, results) VALUES (%s, %s)
                    ON CONFLICT (query) DO UPDATE SET results = EXCLUDED.results, created_at = CURRENT_TIMESTAMP""",
                    (query, json.dumps(results))
                )

def log_results(query, results):
    with psycopg2.connect(os.environ["DB_CONNECTION_STRING"]) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO query_log (query, results) VALUES (%s, %s)""",
                (query, json.dumps(results))
            )