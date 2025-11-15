# Agent: Planner

## Description
Creates structured plans from high-level requests.  
Breaks tasks into executable steps for the executor agent.

## Responsibilities
- Analyze user request
- Break down tasks into steps
- Validate feasibility
- Assign steps to executor

## Capabilities
- Reasoning
- Planning
- Delegation

## Input Format
```json
{ "task": "string" }
