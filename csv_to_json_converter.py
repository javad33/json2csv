#!/usr/bin/env python3
"""
CSV to JSON Converter Application
This script converts CSV files to JSON format.
"""

import csv
import json
import argparse
import sys
from pathlib import Path


def csv_to_json(csv_file_path, json_file_path=None, encoding='utf-8'):
    """
    Convert a CSV file to JSON format.
    
    Args:
        csv_file_path (str): Path to the input CSV file
        json_file_path (str, optional): Path to the output JSON file. 
                                       If None, creates file with .json extension
        encoding (str): File encoding, defaults to 'utf-8'
    
    Returns:
        str: Path to the output JSON file
    """
    # If no JSON file path is provided, create one from the CSV filename
    if json_file_path is None:
        csv_path = Path(csv_file_path)
        json_file_path = csv_path.with_suffix('.json')
    
    # Read the CSV file
    data = []
    with open(csv_file_path, 'r', encoding=encoding) as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            data.append(row)
    
    # Write the JSON file
    with open(json_file_path, 'w', encoding=encoding) as json_file:
        json.dump(data, json_file, indent=2, ensure_ascii=False)
    
    return json_file_path


def main():
    parser = argparse.ArgumentParser(description='Convert CSV file to JSON format')
    parser.add_argument('input', help='Input CSV file path')
    parser.add_argument('-o', '--output', help='Output JSON file path (optional)')
    parser.add_argument('-e', '--encoding', default='utf-8', help='File encoding (default: utf-8)')
    
    args = parser.parse_args()
    
    # Check if input file exists
    if not Path(args.input).exists():
        print(f"Error: Input file '{args.input}' does not exist.")
        sys.exit(1)
    
    try:
        output_path = csv_to_json(args.input, args.output, args.encoding)
        print(f"Successfully converted '{args.input}' to '{output_path}'")
    except Exception as e:
        print(f"Error during conversion: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()