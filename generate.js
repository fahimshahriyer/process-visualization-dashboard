const fs = require("fs");

// Function to generate a random date within the last 30 days
function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Function to generate a random duration between 1 and 60 minutes
function randomDuration() {
  return Math.floor(Math.random() * 59) + 1;
}

// Define process steps
const steps = [
  "Initiate",
  "Validate",
  "Process",
  "Review",
  "Approve",
  "Complete",
];

// Generate sample data
const sampleData = [];
const endDate = new Date();
const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

for (let i = 0; i < 100; i++) {
  const timestamp = randomDate(startDate, endDate);
  for (let j = 0; j < steps.length - 1; j++) {
    sampleData.push({
      id: `${i + 1}-${j + 1}`,
      source: steps[j],
      target: steps[j + 1],
      duration: randomDuration(),
      timestamp: timestamp.toISOString(),
    });
    // Increment timestamp for the next step
    timestamp.setMinutes(timestamp.getMinutes() + randomDuration());
  }
}

// Convert to CSV
const header = "id,source,target,duration,timestamp\n";
const csvContent = sampleData
  .map(
    (row) =>
      `${row.id},${row.source},${row.target},${row.duration},${row.timestamp}`
  )
  .join("\n");

const csvData = header + csvContent;

console.log("Sample CSV data:");
console.log(csvData.slice(0, 500) + "..."); // Display first 500 characters

// Optionally, uncomment the following lines to write to a file
// fs.writeFileSync('sample_process_log.csv', csvData);
// console.log("CSV file 'sample_process_log.csv' has been created.");
