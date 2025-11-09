import base64
import json
import sys

def encode_service_account(file_path):
    """
    Reads a JSON file, and prints its content as a Base64 encoded string.
    """
    try:
        with open(file_path, 'r') as f:
            json_data = json.load(f)
        
        encoded_json = base64.b64encode(json.dumps(json_data).encode('utf-8')).decode('utf-8')
        print(encoded_json)
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
    except json.JSONDecodeError:
        print(f"Error: The file '{file_path}' is not a valid JSON file.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python encode_firebase_key.py <path_to_your_json_file>")
    else:
        encode_service_account(sys.argv[1])