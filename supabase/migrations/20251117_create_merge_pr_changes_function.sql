-- Migration: Create merge_pr_changes RPC function
-- Purpose: Atomically merge Pull Request changes to task contractor_fields
-- Created: 2025-11-17
-- Author: Development Team

-- Drop function if exists (for idempotency)
DROP FUNCTION IF EXISTS merge_pr_changes(UUID, JSONB);

-- Create the merge_pr_changes function
CREATE OR REPLACE FUNCTION merge_pr_changes(
  p_pr_id UUID,
  p_changes JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_change JSONB;
  v_task_id UUID;
  v_field TEXT;
  v_value JSONB;
  v_field_path TEXT[];
  v_changes_count INTEGER := 0;
BEGIN
  -- Validate PR exists
  IF NOT EXISTS (SELECT 1 FROM pull_requests WHERE id = p_pr_id) THEN
    RAISE EXCEPTION 'Pull Request with ID % does not exist', p_pr_id;
  END IF;

  -- Validate changes is an array
  IF jsonb_typeof(p_changes) != 'array' THEN
    RAISE EXCEPTION 'Changes must be a JSONB array';
  END IF;

  -- Iterate through all changes
  FOR v_change IN SELECT * FROM jsonb_array_elements(p_changes)
  LOOP
    -- Extract change details
    v_task_id := (v_change->>'task_id')::UUID;
    v_field := v_change->>'field';
    v_value := v_change->'new_value';
    
    -- Validate task exists
    IF NOT EXISTS (SELECT 1 FROM tasks WHERE id = v_task_id) THEN
      RAISE EXCEPTION 'Task with ID % does not exist', v_task_id;
    END IF;
    
    -- Only allow updates to contractor_fields
    IF v_field LIKE 'contractor_fields.%' THEN
      -- Extract the field path within contractor_fields
      -- Remove 'contractor_fields.' prefix
      v_field_path := string_to_array(substring(v_field from 19), '.');
      
      -- Update the task's contractor_fields using jsonb_set
      UPDATE tasks
      SET 
        contractor_fields = jsonb_set(
          COALESCE(contractor_fields, '{}'::JSONB),
          v_field_path,
          v_value,
          true  -- create_missing = true
        ),
        updated_at = NOW()
      WHERE id = v_task_id;
      
      v_changes_count := v_changes_count + 1;
    ELSE
      -- Log warning for non-contractor_fields updates (but don't fail)
      RAISE NOTICE 'Skipping update to non-contractor field: %', v_field;
    END IF;
  END LOOP;
  
  -- Log the number of changes applied
  RAISE NOTICE 'Applied % changes from PR %', v_changes_count, p_pr_id;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Re-raise the exception to trigger transaction rollback
    RAISE EXCEPTION 'Error merging PR changes: %', SQLERRM;
END;
$$;

-- Add comment to the function
COMMENT ON FUNCTION merge_pr_changes(UUID, JSONB) IS 
'Atomically merge Pull Request changes to task contractor_fields.
Only allows updates to contractor_fields.* paths.
All changes are applied in a single transaction.
Usage: SELECT merge_pr_changes(''pr-uuid'', ''[{"task_id": "task-uuid", "field": "contractor_fields.work_hours", "new_value": 8}]''::JSONB);';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION merge_pr_changes(UUID, JSONB) TO authenticated;

-- Revoke from anon users
REVOKE EXECUTE ON FUNCTION merge_pr_changes(UUID, JSONB) FROM anon;
