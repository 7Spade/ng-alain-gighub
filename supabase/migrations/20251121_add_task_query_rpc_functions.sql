-- Migration: Add RPC functions for task ltree and recursive queries
-- Created: 2025-11-21
-- Description: Implements efficient ltree-based subtree queries and recursive path queries for tasks table

-- ============================================================================
-- Function 1: find_task_subtree
-- ============================================================================
-- Purpose: Find all descendant tasks of a given task using ltree path matching
-- Parameters:
--   - parent_path: The ltree path of the parent task (e.g., 'root.task1.subtask1')
-- Returns: All tasks that are descendants of the given path (including the parent itself)
-- Usage:
--   SELECT * FROM find_task_subtree('root.task1');

CREATE OR REPLACE FUNCTION find_task_subtree(parent_path ltree)
RETURNS SETOF tasks AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM tasks
  WHERE tree_path <@ parent_path OR tree_path = parent_path
  ORDER BY tree_path;
END;
$$ LANGUAGE plpgsql
STABLE
SECURITY DEFINER;

COMMENT ON FUNCTION find_task_subtree(ltree) IS 
'Finds all descendant tasks using ltree path matching. Uses <@ operator to match all paths that are descendants of the given path.';

-- ============================================================================
-- Function 2: find_task_path
-- ============================================================================
-- Purpose: Find the complete path from root to a specific task using recursive query
-- Parameters:
--   - task_id: The UUID of the target task
-- Returns: All tasks in the path from root to the target task, ordered by tree level
-- Usage:
--   SELECT * FROM find_task_path('550e8400-e29b-41d4-a716-446655440000');

CREATE OR REPLACE FUNCTION find_task_path(task_id UUID)
RETURNS SETOF tasks AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE task_path AS (
    -- Base case: Start with the target task
    SELECT * FROM tasks WHERE id = task_id
    
    UNION ALL
    
    -- Recursive case: Get parent tasks
    SELECT t.* 
    FROM tasks t
    INNER JOIN task_path tp ON t.id = tp.parent_task_id
  )
  SELECT * FROM task_path
  ORDER BY tree_level ASC;
END;
$$ LANGUAGE plpgsql
STABLE
SECURITY DEFINER;

COMMENT ON FUNCTION find_task_path(UUID) IS 
'Finds the complete path from root to a specific task using recursive CTE. Returns tasks ordered by tree level from root to target.';

-- ============================================================================
-- Indexes for optimization
-- ============================================================================
-- Ensure ltree index exists for efficient subtree queries
CREATE INDEX IF NOT EXISTS idx_tasks_tree_path_gist ON tasks USING gist (tree_path);

-- Ensure parent_task_id index exists for efficient recursive queries
CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id ON tasks (parent_task_id);

-- ============================================================================
-- Grants
-- ============================================================================
-- Grant execute permissions to authenticated users
-- Adjust these grants based on your RLS policies and security requirements

GRANT EXECUTE ON FUNCTION find_task_subtree(ltree) TO authenticated;
GRANT EXECUTE ON FUNCTION find_task_path(UUID) TO authenticated;

-- ============================================================================
-- Testing Examples
-- ============================================================================
-- Uncomment to test the functions

-- Test find_task_subtree:
-- SELECT id, title, tree_path, tree_level 
-- FROM find_task_subtree('root.milestone1');

-- Test find_task_path:
-- SELECT id, title, tree_path, tree_level, parent_task_id
-- FROM find_task_path('your-task-uuid-here');
