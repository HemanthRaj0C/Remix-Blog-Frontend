import { Plugin } from 'unified';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';

interface ReadTimeOptions {
  wordsPerMinute?: number;
  minutesRoundMethod?: 'ceil' | 'floor' | 'round';
  wordBound?: (char: string) => boolean;
}

interface ReadTimeResults {
  minutes: number;
  text: string;
  time: number;
  words: number;
}

export function calculateReadTime(content: string, options: ReadTimeOptions = {}): ReadTimeResults {
  const {
    wordsPerMinute = 200,
    minutesRoundMethod = 'ceil',
    wordBound = (char: string) => {
      return char.match(/[\s\n\r\t]/) !== null;
    }
  } = options;

  // Handle TSX/JSX content
  const cleanContent = content
    // Remove JSX/TSX comments
    .replace(/{\s*\/\*[\s\S]*?\*\/\s*}/g, '')
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove JSX/TSX components and HTML tags
    .replace(/<[^>]+>/g, ' ')
    // Remove import statements
    .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
    // Remove export statements
    .replace(/export\s+(?:default\s+)?(?:const|let|var|function|class|interface|type)\s+.*?(?={|\n|;)/g, '')
    // Remove TypeScript type annotations
    .replace(/:\s*[A-Za-z<>[\]|&]+/g, '')
    // Remove curly braces blocks (common in JSX)
    .replace(/{[^}]*}/g, ' ');

  let words = 0;
  let start = 0;
  let end = cleanContent.length;

  // Count words using the wordBound function
  while (start < end) {
    while (start < end && wordBound(cleanContent[start])) start++;
    if (start === end) break;

    while (start < end && !wordBound(cleanContent[start])) start++;
    words++;
  }

  // Calculate time
  const minutes = words / wordsPerMinute;
  const time = Math[minutesRoundMethod](minutes * 60);
  const roundedMinutes = Math[minutesRoundMethod](minutes);

  return {
    text: `${roundedMinutes} min read`,
    minutes: roundedMinutes,
    time,
    words
  };
}

// Unified plugin for MDX if needed
export const remarkReadingTime: Plugin = () => {
  return (tree: Node, file: any) => {
    const readingTime = calculateReadTime(file.value);
    file.data.readingTime = readingTime;
  };
};

// Helper function to format the reading time with custom text
export function formatReadTime(content: string, options?: ReadTimeOptions): string {
  const { text } = calculateReadTime(content, options);
  return text;
}