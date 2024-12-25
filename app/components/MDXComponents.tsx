import React from 'react';

export const MDXComponents = {
  h1: (props: any) => (
    <h1 className="text-3xl font-bold mb-6" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-2xl font-semibold mb-4" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-xl font-medium mb-3" {...props} />
  ),
  p: (props: any) => (
    <p className="mb-4 leading-relaxed" {...props} />
  ),
  a: (props: any) => (
    <a className="text-stone-600 hover:text-stone-800 underline" {...props} />
  ),
  ul: (props: any) => (
    <ul className="list-disc list-inside mb-4" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-inside mb-4" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
  ),
  code: (props: any) => (
    <code className="bg-gray-100 rounded px-2 py-1" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-gray-100 rounded p-4 overflow-x-auto my-4" {...props} />
  ),
};