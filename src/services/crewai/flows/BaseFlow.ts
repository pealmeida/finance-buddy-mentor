// Base CrewAI Flow Implementation
// Inspired by CrewAI Flows from context7 documentation

import {
    FlowState,
    FlowStatus,
    FlowContext,
    FlowStep,
    FlowStepType,
    StepStatus,
    FlowExecution,
    FlowExecutionEvent,
    ExecutionEventType,
    ValidationResult
} from '../../../types/flow';
import { A2AAgent, Message, Task } from '../../../types/a2a';
import { UserProfile } from '../../../types/finance';

// ============================================================================
// Flow Error Class
// ============================================================================

export class FlowError extends Error {
    public readonly code: string;
    public readonly details?: Record<string, unknown>;
    public readonly recoverable: boolean;
    public readonly timestamp: Date;

    constructor(config: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
        recoverable: boolean;
        timestamp: Date;
    }) {
        super(config.message);
        this.code = config.code;
        this.details = config.details;
        this.recoverable = config.recoverable;
        this.timestamp = config.timestamp;
        this.name = 'FlowError';
    }
}

// ============================================================================
// Flow Decorators and Utilities
// ============================================================================

// Step decorator to mark methods as flow steps
export function step(config?: {
    name?: string;
    description?: string;
    type?: FlowStepType;
    dependencies?: string[];
    timeout?: number;
}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!target.constructor._flowSteps) {
            target.constructor._flowSteps = new Map();
        }

        target.constructor._flowSteps.set(propertyKey, {
            name: config?.name || propertyKey,
            description: config?.description || `Step: ${propertyKey}`,
            type: config?.type || 'analysis',
            dependencies: config?.dependencies || [],
            timeout: config?.timeout || 30000,
            method: descriptor.value
        });
    };
}

// Start step decorator
export function start(config?: {
    name?: string;
    description?: string;
    timeout?: number;
}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        step({ ...config, type: 'data_collection' })(target, propertyKey, descriptor);

        if (!target.constructor._startStep) {
            target.constructor._startStep = propertyKey;
        }
    };
}

// Listen decorator to create step dependencies
export function listen(dependencies: string | string[], config?: {
    name?: string;
    description?: string;
    type?: FlowStepType;
    timeout?: number;
}) {
    const deps = Array.isArray(dependencies) ? dependencies : [dependencies];

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        step({ ...config, dependencies: deps })(target, propertyKey, descriptor);
    };
}

// Router decorator for conditional flow control
export function router(dependencies: string | string[], config?: {
    name?: string;
    description?: string;
    timeout?: number;
}) {
    const deps = Array.isArray(dependencies) ? dependencies : [dependencies];

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        step({
            ...config,
            dependencies: deps,
            type: 'decision_point'
        })(target, propertyKey, descriptor);
    };
}

// ============================================================================
// Base Flow Class
// ============================================================================

export abstract class BaseFlow<TState extends FlowState = FlowState> {
    protected state: TState;
    protected execution: FlowExecution;
    protected stepResults: Map<string, unknown> = new Map();
    protected listeners: Map<string, Set<string>> = new Map();
    protected completedSteps: Set<string> = new Set();

    constructor(initialState?: Partial<TState>) {
        this.state = this.createInitialState(initialState);
        this.execution = this.createExecution();
        this.setupStepDependencies();
    }

    // ============================================================================
    // Public API
    // ============================================================================

    /**
     * Execute the flow - main entry point
     */
    async kickoff(inputs?: Record<string, unknown>): Promise<unknown> {
        try {
            console.log(`🚀 Starting flow: ${this.constructor.name}`);

            this.updateFlowStatus('running');
            this.logEvent('flow_started', { inputs });

            // Merge inputs into state
            if (inputs) {
                this.state = { ...this.state, ...inputs };
            }

            // Find and execute start step
            const startStepName = this.getStartStep();
            if (!startStepName) {
                throw new Error('No start step defined. Use @start() decorator on a method.');
            }

            const result = await this.executeStep(startStepName);

            this.updateFlowStatus('completed');
            this.logEvent('flow_completed', { result });

            console.log(`✅ Flow completed: ${this.constructor.name}`);
            return result;

        } catch (error: unknown) {
            this.updateFlowStatus('failed');
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logEvent('flow_failed', { error: errorMessage });

            console.error(`❌ Flow failed: ${this.constructor.name}`, error);
            throw error;
        }
    }

    /**
     * Execute flow asynchronously
     */
    async kickoffAsync(inputs?: Record<string, unknown>): Promise<unknown> {
        return this.kickoff(inputs);
    }

    /**
     * Generate a visual plot of the flow structure
     */
    plot(filename?: string): void {
        const plotData = this.generatePlotData();
        const htmlContent = this.generatePlotHTML(plotData);

        if (filename) {
            console.log(`📊 Flow plot would be saved to: ${filename}.html`);
            console.log('Plot data:', plotData);
        } else {
            console.log('📊 Flow structure:');
            console.log(plotData);
        }
    }

    /**
     * Get current flow state
     */
    getState(): TState {
        return { ...this.state };
    }

    /**
     * Get flow execution details
     */
    getExecution(): FlowExecution {
        return { ...this.execution };
    }

    // ============================================================================
    // Protected Methods
    // ============================================================================

    protected async executeStep(stepName: string, previousResult?: unknown): Promise<unknown> {
        const stepConfig = this.getStepConfig(stepName);
        if (!stepConfig) {
            throw new Error(`Step not found: ${stepName}`);
        }

        console.log(`🔄 Executing step: ${stepName}`);
        this.logEvent('step_started', { stepName });

        try {
            // Check dependencies
            const canExecute = await this.canExecuteStep(stepName);
            if (!canExecute) {
                throw new Error(`Step dependencies not met: ${stepName}`);
            }

            // Execute step method
            const startTime = Date.now();
            const result = await stepConfig.method.call(this, previousResult);
            const duration = Date.now() - startTime;

            // Store result
            this.stepResults.set(stepName, result);
            this.completedSteps.add(stepName);

            this.logEvent('step_completed', { stepName, duration });
            console.log(`✅ Step completed: ${stepName}`);

            // Execute dependent steps
            await this.executeListeners(stepName, result);

            return result;

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logEvent('step_failed', { stepName, error: errorMessage });
            throw new FlowError({
                code: 'STEP_EXECUTION_FAILED',
                message: `Step ${stepName} failed: ${errorMessage}`,
                details: { stepName, error },
                recoverable: false,
                timestamp: new Date()
            });
        }
    }

    protected async executeListeners(triggerStep: string, result: unknown): Promise<void> {
        const listeners = this.listeners.get(triggerStep) || new Set();

        // Execute listeners in parallel
        const promises = Array.from(listeners).map(async (listenerStep) => {
            if (await this.canExecuteStep(listenerStep)) {
                return this.executeStep(listenerStep, result);
            }
        });

        await Promise.all(promises);
    }

    protected async canExecuteStep(stepName: string): Promise<boolean> {
        const stepConfig = this.getStepConfig(stepName);
        if (!stepConfig) return false;

        // Check if all dependencies are completed
        for (const dep of stepConfig.dependencies) {
            if (!this.completedSteps.has(dep)) {
                return false;
            }
        }

        return true;
    }

    protected getStepConfig(stepName: string) {
        const steps = (this.constructor as any)._flowSteps;
        return steps?.get(stepName);
    }

    protected getStartStep(): string | null {
        return (this.constructor as any)._startStep || null;
    }

    protected setupStepDependencies(): void {
        const steps = (this.constructor as any)._flowSteps;
        if (!steps) return;

        for (const [stepName, config] of steps) {
            for (const dependency of config.dependencies) {
                if (!this.listeners.has(dependency)) {
                    this.listeners.set(dependency, new Set());
                }
                this.listeners.get(dependency)!.add(stepName);
            }
        }
    }

    protected updateFlowStatus(status: FlowStatus): void {
        this.state.status = status;
        this.state.updatedAt = new Date();
        this.execution.state = this.state;
    }

    protected logEvent(type: ExecutionEventType, data: Record<string, unknown>): void {
        const event: FlowExecutionEvent = {
            id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            executionId: this.execution.id,
            type,
            timestamp: new Date(),
            data
        };

        this.execution.executionHistory.push(event);
    }

    protected generatePlotData() {
        const steps = (this.constructor as any)._flowSteps;
        const startStep = this.getStartStep();

        if (!steps) return { nodes: [], edges: [] };

        const nodes = Array.from(steps.entries() as Iterable<[string, any]>).map(([name, config], index: number) => ({
            id: name,
            label: config.name,
            type: config.type,
            isStart: name === startStep,
            position: { x: index * 200, y: 0 }
        }));

        const edges = [];
        for (const [stepName, config] of steps) {
            for (const dep of config.dependencies) {
                edges.push({
                    source: dep,
                    target: stepName,
                    type: 'dependency'
                });
            }
        }

        return { nodes, edges };
    }

    protected generatePlotHTML(plotData: any): string {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Flow Visualization - ${this.constructor.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .node { background: #f0f0f0; border: 1px solid #ccc; padding: 10px; margin: 5px; }
          .start-node { background: #90EE90; }
        </style>
      </head>
      <body>
        <h1>Flow: ${this.constructor.name}</h1>
        <div>
          ${plotData.nodes.map((node: any) =>
            `<div class="node ${node.isStart ? 'start-node' : ''}">${node.label} (${node.type})</div>`
        ).join('')}
        </div>
        <h2>Dependencies:</h2>
        <ul>
          ${plotData.edges.map((edge: any) =>
            `<li>${edge.source} → ${edge.target}</li>`
        ).join('')}
        </ul>
      </body>
      </html>
    `;
    }

    // ============================================================================
    // Abstract Methods
    // ============================================================================

    protected abstract createInitialState(partial?: Partial<TState>): TState;

    // ============================================================================
    // Private Methods
    // ============================================================================

    private createExecution(): FlowExecution {
        return {
            id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            flowDefinitionId: this.constructor.name,
            state: this.state,
            executionHistory: [],
            artifacts: [],
            metrics: {
                executionTime: 0,
                stepsExecuted: 0,
                stepsSkipped: 0,
                stepsFailed: 0,
                retriesPerformed: 0,
                averageStepDuration: 0,
                resourcesUsed: {
                    cpuTime: 0,
                    memoryUsed: 0,
                    apiCalls: 0,
                    databaseQueries: 0
                }
            }
        };
    }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Logical AND - wait for multiple steps to complete
 */
export function and_(...dependencies: string[]): string {
    return `__AND__${dependencies.join('|')}`;
}

/**
 * Logical OR - trigger when any dependency completes
 */
export function or_(...dependencies: string[]): string {
    return `__OR__${dependencies.join('|')}`;
}

/**
 * Create a structured state for flows
 */
export function createFlowState<T extends FlowState>(overrides: Partial<T> = {}): T {
    const baseState: FlowState = {
        id: `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        currentStep: 0,
        totalSteps: 0,
        status: 'initialized',
        context: {},
        results: {},
        createdAt: new Date(),
        updatedAt: new Date()
    };

    return { ...baseState, ...overrides } as T;
} 