// CrewAI Flow Plot Example
// Demonstrates the built-in plot() functionality and enhanced visualization

import { FinancialAnalysisFlow } from '../services/crewai/flows/FinancialAnalysisFlow';
import { sampleUserProfile } from './financialFlowUsage';

// ============================================================================
// Basic Plot Usage Example
// ============================================================================

export function demonstrateFlowPlot() {
    console.log('🎨 CrewAI Flow Plot Demonstration');
    console.log('=====================================\n');

    // Create a flow instance
    const flow = new FinancialAnalysisFlow({
        userProfile: sampleUserProfile,
        requestedAnalysisType: 'comprehensive'
    });

    console.log('📊 Generating flow plot...\n');

    // Basic plot - outputs to console
    flow.plot();

    console.log('\n📁 Generating named plot file...\n');

    // Named plot - would save to file in real implementation
    flow.plot('financial-analysis-flow-diagram');

    console.log('\n✅ Plot generation complete!');
}

// ============================================================================
// Enhanced Plot Data Extractor
// ============================================================================

export function extractFlowStructure() {
    const flow = new FinancialAnalysisFlow({
        userProfile: sampleUserProfile,
        requestedAnalysisType: 'comprehensive'
    });

    // Access the protected method through type assertion for demonstration
    const plotData = (flow as any).generatePlotData();

    console.log('🔍 Flow Structure Analysis:');
    console.log('============================\n');

    console.log('📋 Flow Steps:');
    plotData.nodes.forEach((node: any, index: number) => {
        console.log(`  ${index + 1}. ${node.label}`);
        console.log(`     • ID: ${node.id}`);
        console.log(`     • Type: ${node.type}`);
        console.log(`     • Start Step: ${node.isStart ? 'Yes' : 'No'}`);
        console.log(`     • Position: (${node.position.x}, ${node.position.y})\n`);
    });

    console.log('🔗 Dependencies:');
    plotData.edges.forEach((edge: any, index: number) => {
        console.log(`  ${index + 1}. ${edge.source} → ${edge.target}`);
    });

    return plotData;
}

// ============================================================================
// Custom Flow Visualization Generator
// ============================================================================

export class FlowVisualizer {
    private flow: FinancialAnalysisFlow;

    constructor(flow: FinancialAnalysisFlow) {
        this.flow = flow;
    }

    generateMermaidDiagram(): string {
        const plotData = (this.flow as any).generatePlotData();

        let mermaid = 'graph TD\n';

        // Add nodes
        plotData.nodes.forEach((node: any) => {
            const nodeStyle = node.isStart ?
                `${node.id}["🚀 ${node.label}<br/><small>${node.type}</small>"]` :
                `${node.id}["${this.getStepIcon(node.type)} ${node.label}<br/><small>${node.type}</small>"]`;
            mermaid += `    ${nodeStyle}\n`;
        });

        // Add edges
        plotData.edges.forEach((edge: any) => {
            mermaid += `    ${edge.source} --> ${edge.target}\n`;
        });

        // Add styling
        mermaid += `
    classDef startNode fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
    classDef analysisNode fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef routerNode fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    
    class ${plotData.nodes.find((n: any) => n.isStart)?.id} startNode
`;

        return mermaid;
    }

    private getStepIcon(type: string): string {
        const icons: Record<string, string> = {
            'data_collection': '📋',
            'analysis': '📊',
            'agent_execution': '🤖',
            'decision_point': '🔍',
            'user_interaction': '👤',
            'notification': '📢',
            'data_storage': '💾'
        };
        return icons[type] || '⚙️';
    }

    generateFlowSummary(): string {
        const plotData = (this.flow as any).generatePlotData();

        let summary = '# Financial Analysis Flow Summary\n\n';
        summary += `**Total Steps**: ${plotData.nodes.length}\n`;
        summary += `**Dependencies**: ${plotData.edges.length}\n\n`;

        summary += '## Flow Steps\n\n';
        plotData.nodes.forEach((node: any, index: number) => {
            summary += `${index + 1}. **${node.label}** (${node.type})\n`;
            if (node.isStart) {
                summary += '   - *Entry point of the flow*\n';
            }

            // Find dependencies
            const dependencies = plotData.edges
                .filter((edge: any) => edge.target === node.id)
                .map((edge: any) => edge.source);

            if (dependencies.length > 0) {
                summary += `   - Depends on: ${dependencies.join(', ')}\n`;
            }

            // Find dependents
            const dependents = plotData.edges
                .filter((edge: any) => edge.source === node.id)
                .map((edge: any) => edge.target);

            if (dependents.length > 0) {
                summary += `   - Triggers: ${dependents.join(', ')}\n`;
            }

            summary += '\n';
        });

        return summary;
    }

    generateExecutionOrder(): string[] {
        const plotData = (this.flow as any).generatePlotData();
        const executionOrder: string[] = [];
        const completed = new Set<string>();

        // Find start node
        const startNode = plotData.nodes.find((node: any) => node.isStart);
        if (startNode) {
            executionOrder.push(startNode.id);
            completed.add(startNode.id);
        }

        // Build execution order based on dependencies
        let changed = true;
        while (changed) {
            changed = false;

            for (const node of plotData.nodes) {
                if (completed.has(node.id)) continue;

                // Check if all dependencies are completed
                const dependencies = plotData.edges
                    .filter((edge: any) => edge.target === node.id)
                    .map((edge: any) => edge.source);

                const allDepsCompleted = dependencies.every((dep: string) => completed.has(dep));

                if (allDepsCompleted) {
                    executionOrder.push(node.id);
                    completed.add(node.id);
                    changed = true;
                }
            }
        }

        return executionOrder;
    }
}

// ============================================================================
// Complete Flow Analysis Example
// ============================================================================

export function analyzeFlowStructure() {
    console.log('🔬 Complete Flow Structure Analysis');
    console.log('====================================\n');

    const flow = new FinancialAnalysisFlow({
        userProfile: sampleUserProfile,
        requestedAnalysisType: 'comprehensive'
    });

    const visualizer = new FlowVisualizer(flow);

    console.log('1. 📊 Basic Plot Output:');
    console.log('------------------------');
    flow.plot();

    console.log('\n2. 📋 Flow Structure Data:');
    console.log('---------------------------');
    const plotData = extractFlowStructure();

    console.log('\n3. 🎨 Mermaid Diagram:');
    console.log('-----------------------');
    const mermaidDiagram = visualizer.generateMermaidDiagram();
    console.log(mermaidDiagram);

    console.log('\n4. 📖 Flow Summary:');
    console.log('-------------------');
    const summary = visualizer.generateFlowSummary();
    console.log(summary);

    console.log('\n5. ⚡ Execution Order:');
    console.log('---------------------');
    const executionOrder = visualizer.generateExecutionOrder();
    executionOrder.forEach((step, index) => {
        console.log(`  ${index + 1}. ${step}`);
    });

    console.log('\n✅ Complete analysis finished!');

    return {
        plotData,
        mermaidDiagram,
        summary,
        executionOrder
    };
}

// ============================================================================
// Usage Example for Web Applications
// ============================================================================

export function getFlowVisualizationData(flow: FinancialAnalysisFlow) {
    const visualizer = new FlowVisualizer(flow);

    return {
        // Raw plot data for custom visualizations
        plotData: (flow as any).generatePlotData(),

        // Mermaid diagram for web rendering
        mermaidDiagram: visualizer.generateMermaidDiagram(),

        // Markdown summary for documentation
        summary: visualizer.generateFlowSummary(),

        // Execution order for progress tracking
        executionOrder: visualizer.generateExecutionOrder(),

        // HTML content for standalone viewing
        htmlContent: (flow as any).generatePlotHTML((flow as any).generatePlotData())
    };
}

// ============================================================================
// Interactive Plot Demo
// ============================================================================

export function runInteractivePlotDemo() {
    console.log('🎮 Interactive Flow Plot Demo');
    console.log('==============================\n');

    const flow = new FinancialAnalysisFlow({
        userProfile: sampleUserProfile,
        requestedAnalysisType: 'comprehensive'
    });

    console.log('Available plot methods:\n');
    console.log('1. flow.plot() - Basic console output');
    console.log('2. flow.plot("filename") - Named file output');
    console.log('3. Custom visualization with FlowVisualizer\n');

    // Demonstrate each method
    console.log('🔄 Running basic plot...');
    flow.plot();

    console.log('\n🔄 Running named plot...');
    flow.plot('my-financial-flow');

    console.log('\n🔄 Running custom visualization...');
    const analysis = analyzeFlowStructure();

    console.log('\n🎉 Demo complete! Check the console output above for all visualization formats.');

    return analysis;
}

// Quick test function
export function testFlowPlot() {
    console.log('🧪 Testing Flow Plot Functionality...\n');

    try {
        const results = runInteractivePlotDemo();
        console.log('\n✅ Flow plot test completed successfully!');
        return results;
    } catch (error) {
        console.error('❌ Flow plot test failed:', error);
        throw error;
    }
} 