#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';

interface CLIArgs {
  inputFile: string;
  outputFile?: string;
  encoding?: string;
}

function parseArguments(): CLIArgs {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: ts-node src/index.ts <input.csv> [-o output.json] [-e encoding]');
    process.exit(1);
  }

  let inputFile = '';
  let outputFile: string | undefined;
  let encoding = 'utf-8';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-o' || args[i] === '--output') {
      outputFile = args[i + 1];
      i++;
    } else if (args[i] === '-e' || args[i] === '--encoding') {
      encoding = args[i + 1];
      i++;
    } else if (!inputFile) {
      inputFile = args[i];
    }
  }

  if (!inputFile) {
    console.error('Input file not specified');
    process.exit(1);
  }

  // If no output file is specified, create one from the input filename
  if (!outputFile) {
    const parsedPath = path.parse(inputFile);
    outputFile = path.join(parsedPath.dir, `${parsedPath.name}.json`);
  }

  return { inputFile, outputFile, encoding };
}

async function convertCsvToJson(inputFile: string, outputFile: string, encoding: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    
    fs.createReadStream(inputFile, { encoding })
      .pipe(csvParser.default())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        try {
          const jsonData = JSON.stringify(results, null, 2);
          fs.writeFileSync(outputFile, jsonData, { encoding });
          console.log(`Successfully converted '${inputFile}' to '${outputFile}'`);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function main() {
  try {
    const { inputFile, outputFile, encoding } = parseArguments();

    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
      console.error(`Error: Input file '${inputFile}' does not exist.`);
      process.exit(1);
    }

    await convertCsvToJson(inputFile, outputFile!, encoding);
  } catch (error) {
    console.error('Error during conversion:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { convertCsvToJson };