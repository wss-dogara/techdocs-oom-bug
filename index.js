const lunr = require('lunr');
const fs = require('fs');
const { memoryUsage } = require('node:process');

// From the LunrSearchEngineIndexer constructor
const builder = new lunr.Builder();
builder.pipeline.add(lunr.trimmer, lunr.stopWordFilter, lunr.stemmer);
builder.searchPipeline.add(lunr.stemmer);
builder.metadataWhitelist = ['position'];

// Reading in the search index manually, the TechDocs collator adds some extra fields to the document
const documents = JSON.parse(fs.readFileSync('search_index.json', {
  encoding: 'utf-8'
})).docs;

// Following is from LunrSearchEngineIndexer.index method
// The next two lines run once on the first batch of documents sent to the indexer
Object.keys(documents[0]).forEach(field => {
    builder.field(field);
});

builder.ref('location');

// This line runs for each batch of documents
documents.forEach(document => {
  builder.add(document);
});

const memoryUsed = memoryUsage();

console.log(`Memory usage. Heap Used: ${memoryUsed.heapUsed / 1000000}MB. Heap Total: ${memoryUsed.heapTotal / 1000000}`);