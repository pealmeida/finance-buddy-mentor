#!/usr/bin/env ts-node

// Standalone script to demonstrate CrewAI Flow Plot functionality
// Run with: npx ts-node scripts/runFlowPlot.ts

import { FinancialAnalysisFlow } from '../src/services/crewai/flows/FinancialAnalysisFlow';
import {
    demonstrateFlowPlot,
    extractFlowStructure,
    analyzeFlowStructure,
    testFlowPlot,
    FlowVisualizer
} from '../src/examples/flowPlotExample';
import { sampleUserProfile } from '../src/examples/financialFlowUsage';

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
    console.log('🎨 CrewAI Flow Plot Demonstration');
    console.log('='.repeat(50));
    console.log('');

    try {
        // Create a flow instance
        console.log('🏗️ Creating FinancialAnalysisFlow instance...');
        const flow = new FinancialAnalysisFlow({
            userProfile: sampleUserProfile,
            requestedAnalysisType: 'comprehensive'
        });
        console.log('✅ Flow instance created successfully!\n');

        // Demonstrate basic plot functionality
        console.log('📊 STEP 1: Basic Flow Plot');
        console.log('-'.repeat(30));
        flow.plot();
        console.log('');

        // Demonstrate named plot functionality
        console.log('📁 STEP 2: Named Flow Plot');
        console.log('-'.repeat(30));
        flow.plot('financial-analysis-workflow');
        console.log('');

        // Extract and display flow structure
        console.log('🔍 STEP 3: Flow Structure Analysis');
        console.log('-'.repeat(30));
        const plotData = (flow as any).generatePlotData();

        console.log('📋 Flow Nodes:');
        plotData.nodes.forEach((node: any, index: number) => {
            const startIndicator = node.isStart ? ' 🚀 START' : '';
            console.log(`  ${index + 1}. ${node.label}${startIndicator}`);
            console.log(`     • Type: ${node.type}`);
            console.log(`     • ID: ${node.id}`);
            console.log('');
        });

        console.log('🔗 Flow Dependencies:');
        plotData.edges.forEach((edge: any, index: number) => {
            console.log(`  ${index + 1}. ${edge.source} → ${edge.target}`);
        });
        console.log('');

        // Generate enhanced visualizations
        console.log('🎨 STEP 4: Enhanced Visualizations');
        console.log('-'.repeat(30));
        const visualizer = new FlowVisualizer(flow);

        console.log('📊 Mermaid Diagram:');
        console.log(visualizer.generateMermaidDiagram());
        console.log('');

        console.log('📖 Flow Summary:');
        console.log(visualizer.generateFlowSummary());
        console.log('');

        console.log('⚡ Execution Order:');
        const executionOrder = visualizer.generateExecutionOrder();
        executionOrder.forEach((step, index) => {
            console.log(`  ${index + 1}. ${step}`);
        });
        console.log('');

        // Display flow statistics
        console.log('📈 STEP 5: Flow Statistics');
        console.log('-'.repeat(30));
        console.log(`Total Steps: ${plotData.nodes.length}`);
        console.log(`Total Dependencies: ${plotData.edges.length}`);
        console.log(`Start Steps: ${plotData.nodes.filter((n: any) => n.isStart).length}`);
        console.log(`Parallel Steps: ${plotData.nodes.filter((n: any) => n.type === 'agent_execution').length}`);
        console.log(`Decision Points: ${plotData.nodes.filter((n: any) => n.type === 'decision_point').length}`);
        console.log('');

        // Generate HTML output example
        console.log('🌐 STEP 6: HTML Output Preview');
        console.log('-'.repeat(30));
        const htmlContent = (flow as any).generatePlotHTML(plotData);
        console.log('HTML content generated (first 500 characters):');
        console.log(htmlContent.substring(0, 500) + '...');
        console.log('');

        console.log('🎉 CrewAI Flow Plot demonstration completed successfully!');
        console.log('✨ Your financial analysis flow is ready for visualization!');

    } catch (error) {
        console.error('❌ Error during flow plot demonstration:', error);
        process.exit(1);
    }
}

// ============================================================================
// Alternative Demo Functions
// ============================================================================

function runQuickDemo() {
    console.log('⚡ Quick CrewAI Flow Plot Demo');
    console.log('='.repeat(40));

    const flow = new FinancialAnalysisFlow({
        userProfile: sampleUserProfile,
        requestedAnalysisType: 'comprehensive'
    });

    console.log('\n1. Basic Plot:');
    flow.plot();

    console.log('\n2. Named Plot:');
    flow.plot('quick-demo-flow');

    console.log('\n✅ Quick demo complete!');
}

function runStructureAnalysis() {
    console.log('🔬 Flow Structure Analysis');
    console.log('='.repeat(40));

    const results = analyzeFlowStructure();

    console.log('\n📊 Analysis Results:');
    console.log(`- Nodes: ${results.plotData.nodes.length}`);
    console.log(`- Edges: ${results.plotData.edges.length}`);
    console.log(`- Execution steps: ${results.executionOrder.length}`);

    return results;
}

// ============================================================================
// Execute based on command line arguments
// ============================================================================

const args = process.argv.slice(2);
const command = args[0] || 'full';

switch (command) {
    case 'quick':
        runQuickDemo();
        break;
    case 'analyze':
        runStructureAnalysis();
        break;
    case 'test':
        testFlowPlot();
        break;
    case 'full':
    default:
        main().catch(console.error);
        break;
} 