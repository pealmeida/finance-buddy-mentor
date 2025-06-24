#!/usr/bin/env node

// CrewAI Flow Plot Simulator with HTML Support
// This script replaces the need for the Python `crewai flow plot` command

const fs = require('fs');
const path = require('path');

console.log("🎨 CrewAI Flow Plot - JavaScript Implementation");
console.log("=".repeat(60));
console.log("");

const args = process.argv.slice(2);
const format = args[0] || "console";
const save = args.includes('--save');

console.log(`📊 Plotting flow: FinancialAnalysisFlow`);
console.log(`📁 Output format: ${format}`);
console.log(`💾 Save to file: ${save ? 'Yes' : 'No'}`);
console.log("");

// Mermaid diagram definition
const mermaidDiagram = `graph TD
    initializeAnalysis["🚀 Initialize Analysis<br/><small>data_collection</small>"]
    collectFinancialData["📋 Collect Financial Data<br/><small>data_collection</small>"]
    performBudgetAnalysis["🤖 Budget Analysis<br/><small>agent_execution</small>"]
    performInvestmentAnalysis["🤖 Investment Analysis<br/><small>agent_execution</small>"]
    performSavingsAnalysis["🤖 Savings Analysis<br/><small>agent_execution</small>"]
    performGoalAnalysis["🤖 Goal Analysis<br/><small>agent_execution</small>"]
    determineAnalysisConfidence["🔍 Determine Confidence<br/><small>decision_point</small>"]
    generateComprehensiveAnalysis["📊 Comprehensive Analysis<br/><small>analysis</small>"]
    generateBasicAnalysis["📊 Basic Analysis<br/><small>analysis</small>"]
    requestAdditionalData["👤 Request Data<br/><small>user_interaction</small>"]
    generateRecommendations["📊 Generate Recommendations<br/><small>analysis</small>"]
    finalizeAnalysis["💾 Finalize Analysis<br/><small>data_storage</small>"]
    
    initializeAnalysis --> collectFinancialData
    collectFinancialData --> performBudgetAnalysis
    collectFinancialData --> performInvestmentAnalysis
    collectFinancialData --> performSavingsAnalysis
    collectFinancialData --> performGoalAnalysis
    performBudgetAnalysis --> determineAnalysisConfidence
    performInvestmentAnalysis --> determineAnalysisConfidence
    performSavingsAnalysis --> determineAnalysisConfidence
    performGoalAnalysis --> determineAnalysisConfidence
    determineAnalysisConfidence --> generateComprehensiveAnalysis
    determineAnalysisConfidence --> generateBasicAnalysis
    determineAnalysisConfidence --> requestAdditionalData
    generateComprehensiveAnalysis --> generateRecommendations
    generateBasicAnalysis --> generateRecommendations
    requestAdditionalData --> generateRecommendations
    generateRecommendations --> finalizeAnalysis

    classDef startNode fill:#90EE90,stroke:#228B22,stroke-width:3px
    classDef dataNode fill:#E6F3FF,stroke:#4169E1,stroke-width:2px
    classDef agentNode fill:#FFE4B5,stroke:#FF8C00,stroke-width:2px
    classDef decisionNode fill:#FFB6C1,stroke:#DC143C,stroke-width:3px
    classDef analysisNode fill:#E0E6FF,stroke:#6A5ACD,stroke-width:2px
    classDef interactionNode fill:#FFEFD5,stroke:#D2691E,stroke-width:2px
    classDef storageNode fill:#F0FFF0,stroke:#32CD32,stroke-width:3px

    class initializeAnalysis startNode
    class collectFinancialData dataNode
    class performBudgetAnalysis,performInvestmentAnalysis,performSavingsAnalysis,performGoalAnalysis agentNode
    class determineAnalysisConfidence decisionNode
    class generateComprehensiveAnalysis,generateBasicAnalysis,generateRecommendations analysisNode
    class requestAdditionalData interactionNode
    class finalizeAnalysis storageNode`;

// Flow plot output
if (format === "html") {
  generateHTML();
} else if (format === "mermaid") {
  console.log("📊 MERMAID DIAGRAM:");
  console.log("-".repeat(50));
  console.log(mermaidDiagram);
} else if (format === "json") {
  generateJSON();
} else {
  console.log("📊 FLOW STRUCTURE:");
  console.log("-".repeat(50));
  console.log("🚀 START: Initialize Analysis (data_collection)");
  console.log("📋 Collect Financial Data (data_collection)");
  console.log("🔄 PARALLEL: Budget, Investment, Savings, Goal Analysis");
  console.log("🔍 DECISION: Determine Analysis Confidence (router)");
  console.log("📊 CONDITIONAL: Comprehensive/Basic/Request Data");
  console.log("🎯 Generate Recommendations (analysis)");
  console.log("💾 FINISH: Finalize Analysis (data_storage)");
  console.log("");
  console.log("📈 Statistics: 12 steps, 4 parallel, 1 decision point");
}

console.log("");
console.log("✅ Flow plot completed successfully!");
console.log("💡 Usage: node scripts/crewai-flow-plot.js [console|mermaid|html|json] [--save]");

function generateHTML() {
  console.log("🌐 GENERATING HTML VISUALIZATION:");
  console.log("-".repeat(50));
  
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CrewAI Flow Plot - FinancialAnalysisFlow</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; padding: 20px;
        }
        .container {
            max-width: 1400px; margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px; overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            color: white; text-align: center; padding: 40px 20px;
        }
        .title { font-size: 3em; font-weight: 700; margin-bottom: 10px; }
        .subtitle { font-size: 1.3em; opacity: 0.9; }
        .main-content { padding: 40px; }
        .section-title {
            font-size: 1.8em; font-weight: 600; margin-bottom: 20px;
            color: #2c3e50; display: flex; align-items: center; gap: 10px;
        }
        .flow-diagram {
            background: #f8f9fa; border-radius: 15px; padding: 30px;
            margin: 20px 0; border: 1px solid #e9ecef;
        }
        .stats-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px; margin: 30px 0;
        }
        .stat-card {
            background: linear-gradient(135deg, #6c63ff 0%, #764ba2 100%);
            color: white; padding: 25px; border-radius: 15px; text-align: center;
            transition: transform 0.3s ease; cursor: pointer;
        }
        .stat-card:hover { transform: translateY(-5px); }
        .stat-number { font-size: 2.5em; font-weight: 700; margin-bottom: 5px; }
        .stat-label { font-size: 1em; opacity: 0.9; }
        .features-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px; margin: 30px 0;
        }
        .feature-card {
            background: white; border-radius: 12px; padding: 25px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease;
        }
        .feature-card:hover { transform: translateY(-3px); }
        .feature-icon { font-size: 2em; margin-bottom: 15px; color: #6c63ff; }
        .feature-title { font-size: 1.3em; font-weight: 600; margin-bottom: 10px; }
        .footer { background: #f8f9fa; text-align: center; padding: 30px; color: #6c757d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">🎨 CrewAI Flow Plot</h1>
            <p class="subtitle">Financial Analysis Workflow Visualization</p>
            <p>Generated: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="main-content">
            <div class="section-title">📊 Flow Visualization</div>
            <div class="flow-diagram">
                <div class="mermaid">${mermaidDiagram}</div>
            </div>
            
            <div class="section-title">📈 Flow Statistics</div>
            <div class="stats-grid">
                <div class="stat-card"><div class="stat-number">12</div><div class="stat-label">Total Steps</div></div>
                <div class="stat-card"><div class="stat-number">4</div><div class="stat-label">Parallel Steps</div></div>
                <div class="stat-card"><div class="stat-number">1</div><div class="stat-label">Decision Points</div></div>
                <div class="stat-card"><div class="stat-number">3</div><div class="stat-label">Conditional Paths</div></div>
            </div>
            
            <div class="section-title">⭐ Key Features</div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🔄</div>
                    <h3 class="feature-title">Parallel Processing</h3>
                    <p>Budget, Investment, Savings, and Goals analysis run simultaneously.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <h3 class="feature-title">Adaptive Routing</h3>
                    <p>Confidence-based routing ensures appropriate analysis depth.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🤖</div>
                    <h3 class="feature-title">Agent Integration</h3>
                    <p>Seamless connection with Google's A2A protocol.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3 class="feature-title">Visual Debugging</h3>
                    <p>Clear workflow structure for development and debugging.</p>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>🎨 CrewAI Flow Plot | Generated by Finance Buddy Mentor</p>
        </div>
    </div>
    
    <script>
        mermaid.initialize({
            startOnLoad: true, theme: 'default',
            flowchart: { useMaxWidth: true, htmlLabels: true }
        });
        
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🎨 CrewAI Flow Plot loaded successfully!');
            document.querySelectorAll('.stat-card').forEach(card => {
                card.addEventListener('click', function() {
                    const label = this.querySelector('.stat-label').textContent;
                    const number = this.querySelector('.stat-number').textContent;
                    alert(label + ': ' + number);
                });
            });
        });
    </script>
</body>
</html>`;

  if (save) {
    const filename = 'financial-analysis-flow.html';
    fs.writeFileSync(filename, htmlContent);
    console.log(`📁 HTML file saved: ${filename}`);
    console.log(`🌐 Open in browser: file://${path.resolve(filename)}`);
  } else {
    console.log("HTML content generated successfully!");
    console.log("📁 Add --save flag to save to file");
  }
  
  console.log("🎨 Interactive features included:");
  console.log("  • Responsive Mermaid diagram");
  console.log("  • Clickable statistics cards");
  console.log("  • Professional styling");
  console.log("  • Mobile-friendly design");
}

function generateJSON() {
  console.log("📊 JSON FLOW DATA:");
  console.log("-".repeat(50));
  
  const flowData = {
    "flowName": "FinancialAnalysisFlow",
    "version": "1.0.0",
    "description": "Comprehensive financial analysis workflow with A2A integration",
    "generated": new Date().toISOString(),
    "statistics": {
      "totalSteps": 12,
      "parallelSteps": 4,
      "decisionPoints": 1,
      "conditionalPaths": 3
    }
  };
  
  console.log(JSON.stringify(flowData, null, 2));
  
  if (save) {
    const filename = 'financial-analysis-flow.json';
    fs.writeFileSync(filename, JSON.stringify(flowData, null, 2));
    console.log(`📁 JSON data saved: ${filename}`);
  }
}