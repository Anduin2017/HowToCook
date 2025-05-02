#!/usr/bin/env python3
"""
Parse the starsystem directory of HowToCook recipes and convert to JSON format.

This script can:
1. Parse the starsystem directory to extract dish information and output as JSON
2. Read the content of a specific dish markdown file
3. Find a dish by name and display its content

Usage:
    python parse_starsystem.py                   # Output all dishes as JSON
    python parse_starsystem.py --read-dish PATH  # Read a specific dish by path
    python parse_starsystem.py --find-dish NAME  # Find a dish by name
"""

import os
import re
import json
import sys
from mcp.server.fastmcp import FastMCP

# Create an MCP server
mcp = FastMCP("How to Cook MCP Server")

@mcp.tool()
def read_menu() -> dict:
    """
    Read all dishes from the starsystem directory and return as JSON.
    """
    result = []
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Set starsystem_dir relative to the script location
    starsystem_dir = os.path.join(script_dir, "starsystem")
    
    try:
        # Get all star rating files
        star_files = [f for f in os.listdir(starsystem_dir) if f.endswith("Star.md")]
        print(f"Found star files: {star_files}", file=sys.stderr)
        
        for star_file in star_files:
            # Extract star rating from filename (e.g., "1Star.md" -> 1)
            star_match = re.match(r"(\d+)Star\.md", star_file)
            if not star_match:
                continue
            
            star_rating = int(star_match.group(1))
            file_path = os.path.join(starsystem_dir, star_file)
            
            print(f"Processing file: {file_path}", file=sys.stderr)
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Extract dish entries (lines starting with '*')
                dish_lines = re.findall(r'^\* \[(.*?)\]\((.*?)\)', content, re.MULTILINE)
                
                print(f"Found {len(dish_lines)} dishes in {star_file}", file=sys.stderr)
                
                for dish_name, dish_path in dish_lines:
                    result.append({
                        "star": star_rating,
                        "dishName": dish_name,
                        "path": dish_path
                    })
            except Exception as e:
                print(f"Error processing {file_path}: {e}", file=sys.stderr)
    except Exception as e:
        print(f"Error listing directory {starsystem_dir}: {e}", file=sys.stderr)
    
    return {"dishes": result}

def resolve_path(relative_path):
    """
    Resolve a path relative to the script directory.
    
    Args:
        relative_path (str): The relative path to resolve
        
    Returns:
        str: The absolute path
    """
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Handle paths that start with "./../" by removing the prefix
    if relative_path.startswith("./../"):
        relative_path = relative_path[5:]  # Remove the "./../" prefix
    
    # Convert to absolute path
    return os.path.join(script_dir, relative_path)

@mcp.tool()
def read_dish_content(dish_path: str) -> str:
    """
    Read the content of a dish markdown file based on its path.
    
    Args:
        dish_path (str): The relative path to the dish markdown file
        
    Returns:
        str: The content of the markdown file, or None if the file could not be read
    """
    # Resolve the path
    absolute_path = resolve_path(dish_path)
    
    try:
        with open(absolute_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return content
    except Exception as e:
        print(f"Error reading dish file {absolute_path}: {e}", file=sys.stderr)
        return None

def find_dish_by_name(dish_name):
    """
    Find a dish by its name and return its details
    
    Args:
        dish_name (str): The name of the dish to find
        
    Returns:
        dict: The dish details if found, None otherwise
    """
    dishes_json = read_starsystem_to_json()
    
    for dish in dishes_json['dishes']:
        if dish['dishName'] == dish_name:
            return dish
    
    # Try a case-insensitive partial match if exact match not found
    for dish in dishes_json['dishes']:
        if dish_name.lower() in dish['dishName'].lower():
            return dish
    
    return None

def main():
    try:
        # Parse starsystem files and convert to JSON
        dishes_json = read_starsystem_to_json()
        
        # Print JSON output
        print(json.dumps(dishes_json, ensure_ascii=False, indent=2))
        
        # Optionally, write to a file
        with open('dishes.json', 'w', encoding='utf-8') as f:
            json.dump(dishes_json, f, ensure_ascii=False, indent=2)
        
        print(f"Successfully processed {len(dishes_json['dishes'])} dishes", file=sys.stderr)
        
        # Example of using read_dish_content function
        if len(dishes_json['dishes']) > 0:
            example_dish = dishes_json['dishes'][0]
            dish_path = example_dish['path']
            dish_content = read_dish_content(dish_path)
            
            if dish_content:
                print(f"\nExample dish content for '{example_dish['dishName']}':", file=sys.stderr)
                print(f"{'-' * 40}", file=sys.stderr)
                print(dish_content[:500] + "..." if len(dish_content) > 500 else dish_content, file=sys.stderr)
                print(f"{'-' * 40}", file=sys.stderr)
    except Exception as e:
        print(f"Error in main function: {e}", file=sys.stderr)

if __name__ == "__main__":
    # Check for command-line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == "--read-dish":
            if len(sys.argv) > 2:
                dish_path = sys.argv[2]
                content = read_dish_content(dish_path)
                if content:
                    print(content)
                else:
                    print(f"Could not read dish content for path: {dish_path}", file=sys.stderr)
            else:
                print("Please provide a dish path to read", file=sys.stderr)
        elif sys.argv[1] == "--find-dish":
            if len(sys.argv) > 2:
                dish_name = sys.argv[2]
                dish = find_dish_by_name(dish_name)
                if dish:
                    print(f"Found dish: {dish['dishName']} ({dish['star']} stars)", file=sys.stderr)
                    print(f"Path: {dish['path']}", file=sys.stderr)
                    content = read_dish_content(dish['path'])
                    if content:
                        print("\n" + content)
                    else:
                        print(f"Could not read dish content", file=sys.stderr)
                else:
                    print(f"No dish found with name: {dish_name}", file=sys.stderr)
            else:
                print("Please provide a dish name to search for", file=sys.stderr)
        else:
            main()
    else:
        main()
