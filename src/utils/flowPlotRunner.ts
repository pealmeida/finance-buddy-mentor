import { FinancialAnalysisFlow } from '../services/crewai/flows/FinancialAnalysisFlow';
import { FlowVisualizer } from '../examples/flowPlotExample';
import { sampleUserProfile } from '../examples/financialFlowUsage';

/**
 * TypeScript implementation of CrewAI flow plot functionality
 * This replaces the need for Python's `crewai flow plot` command
 */
export class CrewAIFlowPlotter {

    /**
     * Main plot function - equivalent to `crewai flow plot`
     */
    static async runFlowPlot(options: {
        flowName?: string;
        outputFormat?: 'console' | 'html' | 'mermaid' | 'json';
        saveToFile?: boolean;
    } = {}) {
        const {
            flowName = 'FinancialAnalysisFlow',
            outputFormat = 'console',
            saveToFile = false
        } = options;

        console.log('🎨 CrewAI Flow Plot - TypeScript Implementation');
        console.log('='.repeat(50));
        console.log(`📊 Plotting flow: ${flowName}`);
        console.log(`📁 Output format: ${outputFormat}`);
        console.log('');

        try {
            // Create flow instance
            const flow = new FinancialAnalysisFlow({
                userProfile: sampleUserProfile,
                requestedAnalysisType: 'comprehensive'
            });

            // Generate plot based on format
            switch (outputFormat) {
                case 'console':
                    this.plotToConsole(flow);
                    break;
                case 'html':
                    await this.plotToHTML(flow, flowName, saveToFile);
                    break;
                case 'mermaid':
                    this.plotToMermaid(flow);
                    break;
                case 'json':
                    this.plotToJSON(flow);
                    break;
                default:
                    this.plotToConsole(flow);
            }

            console.log('✅ Flow plot completed successfully!');

        } catch (error) {
            console.error('❌ Error plotting flow:', error);
            throw error;
        }
    }

    /**
     * Plot to console (default behavior)
     */
    private static plotToConsole(flow: FinancialAnalysisFlow) {
        console.log('📊 Flow Structure (Console Output):');
        console.log('-'.repeat(40));

        flow.plot(); // Use the built-in plot method

        // Additional details
        const visualizer = new FlowVisualizer(flow);
        console.log('\n📋 Flow Summary:');
        console.log(visualizer.generateFlowSummary());

        console.log('\n⚡ Execution Order:');
        const executionOrder = visualizer.generateExecutionOrder();
        executionOrder.forEach((step, index) => {
            console.log(`  ${index + 1}. ${step}`);
        });
    }

    /**
     * Plot to HTML file
     */
    private static async plotToHTML(flow: FinancialAnalysisFlow, flowName: string, saveToFile: boolean) {
        console.log('🌐 Generating HTML plot...');

        const visualizer = new FlowVisualizer(flow);
        const mermaidDiagram = visualizer.generateMermaidDiagram();

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CrewAI Flow Plot - ${flowName}</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 30px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 20px;
        }
        .title {
            color: #2c3e50;
            margin: 0;
            font-size: 2.5em;
        }
        .subtitle {
            color: #7f8c8d;
            margin: 10px 0;
            font-size: 1.2em;
        }
        .flow-diagram {
            margin: 30px 0;
            text-align: center;
        }
        .summary {
            background: #f8f9fa;
            border-left: 4px solid #007bff;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .execution-order {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .execution-order ol {
            margin: 0;
            padding-left: 20px;
        }
        .execution-order li {
            margin: 5px 0;
            font-family: 'Courier New', monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">🎨 CrewAI Flow Plot</h1>
            <p class="subtitle">Financial Analysis Workflow Visualization</p>
            <p>Generated: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="flow-diagram">
            <div class="mermaid">
                ${mermaidDiagram}
            </div>
        </div>
        
        <div class="summary">
            <h3>📋 Flow Summary</h3>
            <pre>${visualizer.generateFlowSummary()}</pre>
        </div>
        
        <div class="execution-order">
            <h3>⚡ Execution Order</h3>
            <ol>
                ${visualizer.generateExecutionOrder().map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>
    </div>
    
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
    </script>
</body>
</html>`;

        if (saveToFile) {
            // In a real implementation, you'd save this to a file
            console.log(`📁 HTML would be saved to: ${flowName}-plot.html`);
        }

        console.log('HTML content generated (first 500 chars):');
        console.log(htmlContent.substring(0, 500) + '...');
    }

    /**
     * Plot to Mermaid format
     */
    private static plotToMermaid(flow: FinancialAnalysisFlow) {
        console.log('📊 Mermaid Diagram:');
        console.log('-'.repeat(40));

        const visualizer = new FlowVisualizer(flow);
        console.log(visualizer.generateMermaidDiagram());
    }

    /**
     * Plot to JSON format
     */
    private static plotToJSON(flow: FinancialAnalysisFlow) {
        console.log('📊 JSON Flow Data:');
        console.log('-'.repeat(40));

        const plotData = (flow as any).generatePlotData();
        console.log(JSON.stringify(plotData, null, 2));
    }

    /**
     * Command-line interface simulation
     */
    static async simulateCrewAICLI(args: string[] = []) {
        const command = args[0] || 'plot';
        const subcommand = args[1] || '';

        if (command === 'flow' && subcommand === 'plot') {
            // Parse additional options
            const format = args.includes('--format') ?
                args[args.indexOf('--format') + 1] : 'console';
            const save = args.includes('--save');

            await this.runFlowPlot({
                outputFormat: format as any,
                saveToFile: save
            });
        } else {
            console.log('❌ Unknown command. Available: flow plot');
            console.log('💡 Usage: npm run flow:plot [--format console|html|mermaid|json] [--save]');
        }
    }
}

// Export convenience functions
export const plotFlow = CrewAIFlowPlotter.runFlowPlot;
export const simulateCrewAI = CrewAIFlowPlotter.simulateCrewAICLI; 