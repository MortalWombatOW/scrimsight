import { BronzeSchemaMap } from '../schemas/bronzeSchema';
import sha256 from 'crypto-js/sha256';
// Import the whole module to access non-exported entities
import * as ScrimTime from '../../atoms/files/scrimtime';

// Access the LOG_SPEC even though it's not exported
const LOG_SPEC = ScrimTime.LOG_SPEC;

// Intermediate type for parsed log line
interface ParsedLogLine {
  eventType: string;
  data: Record<string, any>;
}

/**
 * Parse a single log line into a structured object based on LOG_SPEC
 */
export const parseLogLine = (
  line: string, 
  match_id: string, 
  source_filename: string, 
  load_timestamp: number,
  logSpec: Record<string, any>
): ParsedLogLine | null => {
  try {
    const values = line.trim().split(',');
    if (values.length < 2) {
      return null;
    }
    
    const timestampStr = values[0];
    const event_type = values[1];
    const eventSpec = logSpec[event_type];
    
    if (!eventSpec) {
      console.warn(`Event spec not found for event type: ${event_type}`);
      return null;
    }
    
    // Parse timestamp - Format: "[HH:MM:SS]"
    const timestamp = parseTimestampString(timestampStr);
    
    // Initialize result with common fields
    const data: Record<string, any> = {
      match_id,
      event_type,
      match_time: timestamp,
      source_filename,
      load_timestamp
    };
    
    // Parse remaining values based on field specs
    for (let i = 0; i < eventSpec.fields.length - 3; i++) {  // -3 to skip the common fields
      const valueIndex = i + 2; // +2 to skip timestamp and event_type
      if (valueIndex >= values.length) {
        break;
      }
      
      const fieldSpec = eventSpec.fields[i + 3]; // +3 to skip the common fields
      if (!fieldSpec) {
        console.warn(`Field spec not found for event type: ${event_type}, field index: ${i + 3}`);
        continue;
      }
      
      // Parse value based on data type
      data[fieldSpec.key] = parseFieldValue(values[valueIndex], fieldSpec.dataType);
    }
    
    return { eventType: event_type, data };
  } catch (error) {
    console.error(`Error parsing log line: ${line}`, error);
    return null;
  }
};

/**
 * Parse a timestamp string in the format "[HH:MM:SS]" to seconds
 */
const parseTimestampString = (timestampStr: string): number => {
  try {
    // Extract the time from square brackets
    const timestamp = timestampStr.substring(1, timestampStr.length - 1);
    const timeParts = timestamp.split(':');
    
    if (timeParts.length !== 3) {
      throw new Error(`Invalid timestamp format: ${timestampStr}`);
    }
    
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);
    
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      throw new Error(`Invalid time parts in timestamp: ${timestampStr}`);
    }
    
    return hours * 3600 + minutes * 60 + seconds;
  } catch (error) {
    console.error(`Error parsing timestamp: ${timestampStr}`, error);
    return 0;
  }
};

/**
 * Parse a field value based on its data type
 */
const parseFieldValue = (value: string, dataType: string): any => {
  switch (dataType) {
    case 'string':
      return value;
    case 'number':
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    case 'boolean':
      return value.toLowerCase() === 'true';
    default:
      console.warn(`Unsupported data type: ${dataType}`);
      return value;
  }
};

/**
 * Generate a consistent match ID from file content
 */
const generateMatchId = (fileContent: string): string => {
  return sha256(fileContent).toString();
};

/**
 * Process raw logs to create Bronze layer data with validation
 */
export const processRawLogsToBronze = async (
  rawLogs: { fileName: string; fileContent: string; fileModified: number; }[]
): Promise<Record<string, any[]>> => {
  const bronzeData: Record<string, any[]> = {};
  const load_timestamp = Date.now();
  
  for (const rawLog of rawLogs) {
    try {
      const match_id = generateMatchId(rawLog.fileContent);
      const lines = rawLog.fileContent.split('\n').filter(line => line.trim().length > 0);
      
      for (const line of lines) {
        const parsedLine = parseLogLine(
          line, 
          match_id, 
          rawLog.fileName, 
          load_timestamp,
          LOG_SPEC
        );
        
        if (!parsedLine) {
          continue;
        }
        
        const { eventType, data } = parsedLine;
        const schema = BronzeSchemaMap[eventType as keyof typeof BronzeSchemaMap];
        
        if (!schema) {
          console.warn(`Schema not found for event type: ${eventType}`);
          continue;
        }
        
        const validationResult = schema.safeParse(data);
        
        if (validationResult.success) {
          // Initialize array if it doesn't exist
          if (!bronzeData[eventType]) {
            bronzeData[eventType] = [];
          }
          
          bronzeData[eventType].push(validationResult.data);
        } else {
          console.warn(`Validation failed for event type: ${eventType}`, validationResult.error);
        }
      }
    } catch (error) {
      console.error(`Error processing file: ${rawLog.fileName}`, error);
    }
  }
  
  return bronzeData;
};