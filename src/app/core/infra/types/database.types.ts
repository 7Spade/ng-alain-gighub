export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          auth_user_id: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          metadata: Json | null
          name: string
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          metadata?: Json | null
          name: string
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          action: string
          action_details: Json | null
          actor_id: string
          blueprint_id: string
          branch_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          action_details?: Json | null
          actor_id: string
          blueprint_id: string
          branch_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          action_details?: Json | null
          actor_id?: string
          blueprint_id?: string
          branch_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "blueprint_branches"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_cache: {
        Row: {
          aggregation_level: string | null
          blueprint_id: string | null
          branch_id: string | null
          cache_key: string
          cache_type: string
          data: Json
          expires_at: string
          generated_at: string | null
          id: string
        }
        Insert: {
          aggregation_level?: string | null
          blueprint_id?: string | null
          branch_id?: string | null
          cache_key: string
          cache_type: string
          data: Json
          expires_at: string
          generated_at?: string | null
          id?: string
        }
        Update: {
          aggregation_level?: string | null
          blueprint_id?: string | null
          branch_id?: string | null
          cache_key?: string
          cache_type?: string
          data?: Json
          expires_at?: string
          generated_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_cache_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_cache_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "blueprint_branches"
            referencedColumns: ["id"]
          },
        ]
      }
      blueprint_branches: {
        Row: {
          blueprint_id: string
          branch_name: string
          branch_type: string | null
          forked_at: string | null
          id: string
          last_sync_at: string | null
          notes: string | null
          organization_id: string
          status: string | null
        }
        Insert: {
          blueprint_id: string
          branch_name: string
          branch_type?: string | null
          forked_at?: string | null
          id?: string
          last_sync_at?: string | null
          notes?: string | null
          organization_id: string
          status?: string | null
        }
        Update: {
          blueprint_id?: string
          branch_name?: string
          branch_type?: string | null
          forked_at?: string | null
          id?: string
          last_sync_at?: string | null
          notes?: string | null
          organization_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blueprint_branches_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blueprint_branches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      blueprint_configs: {
        Row: {
          blueprint_id: string
          config_key: string
          config_value: Json
          id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          blueprint_id: string
          config_key: string
          config_value: Json
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          blueprint_id?: string
          config_key?: string
          config_value?: Json
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blueprint_configs_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blueprint_configs_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      blueprints: {
        Row: {
          budget: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          metadata: Json | null
          name: string
          owner_id: string
          project_code: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          name: string
          owner_id: string
          project_code?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          name?: string
          owner_id?: string
          project_code?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blueprints_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_execution_logs: {
        Row: {
          bot_id: string
          bot_task_id: string | null
          error_logs: Json | null
          executed_at: string | null
          execution_details: Json | null
          execution_duration_ms: number | null
          execution_status: string
          id: string
          items_failed: number | null
          items_processed: number | null
        }
        Insert: {
          bot_id: string
          bot_task_id?: string | null
          error_logs?: Json | null
          executed_at?: string | null
          execution_details?: Json | null
          execution_duration_ms?: number | null
          execution_status: string
          id?: string
          items_failed?: number | null
          items_processed?: number | null
        }
        Update: {
          bot_id?: string
          bot_task_id?: string | null
          error_logs?: Json | null
          executed_at?: string | null
          execution_details?: Json | null
          execution_duration_ms?: number | null
          execution_status?: string
          id?: string
          items_failed?: number | null
          items_processed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_execution_logs_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_execution_logs_bot_task_id_fkey"
            columns: ["bot_task_id"]
            isOneToOne: false
            referencedRelation: "bot_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_tasks: {
        Row: {
          bot_id: string
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          max_retries: number | null
          priority: number | null
          retry_count: number | null
          scheduled_at: string | null
          started_at: string | null
          status: string | null
          task_config: Json
          task_type: string
        }
        Insert: {
          bot_id: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          max_retries?: number | null
          priority?: number | null
          retry_count?: number | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string | null
          task_config: Json
          task_type: string
        }
        Update: {
          bot_id?: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          max_retries?: number | null
          priority?: number | null
          retry_count?: number | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string | null
          task_config?: Json
          task_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_tasks_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      bots: {
        Row: {
          account_id: string
          bot_type: string
          config: Json
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_enabled: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          account_id: string
          bot_type: string
          config: Json
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          bot_type?: string
          config?: Json
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bots_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bots_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      branch_forks: {
        Row: {
          blueprint_id: string
          branch_id: string
          fork_reason: string | null
          forked_at: string | null
          forked_by: string
          forked_from_task_id: string | null
          id: string
        }
        Insert: {
          blueprint_id: string
          branch_id: string
          fork_reason?: string | null
          forked_at?: string | null
          forked_by: string
          forked_from_task_id?: string | null
          id?: string
        }
        Update: {
          blueprint_id?: string
          branch_id?: string
          fork_reason?: string | null
          forked_at?: string | null
          forked_by?: string
          forked_from_task_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "branch_forks_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branch_forks_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "blueprint_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branch_forks_forked_by_fkey"
            columns: ["forked_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branch_forks_forked_from_task_id_fkey"
            columns: ["forked_from_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      branch_permissions: {
        Row: {
          account_id: string
          branch_id: string
          granted_at: string | null
          granted_by: string
          id: string
          permission_level: string
        }
        Insert: {
          account_id: string
          branch_id: string
          granted_at?: string | null
          granted_by: string
          id?: string
          permission_level: string
        }
        Update: {
          account_id?: string
          branch_id?: string
          granted_at?: string | null
          granted_by?: string
          id?: string
          permission_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "branch_permissions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branch_permissions_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "blueprint_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branch_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_invitations: {
        Row: {
          blueprint_id: string
          created_at: string | null
          expires_at: string
          from_org_id: string
          id: string
          invitation_message: string | null
          responded_at: string | null
          status: string | null
          to_org_id: string
        }
        Insert: {
          blueprint_id: string
          created_at?: string | null
          expires_at: string
          from_org_id: string
          id?: string
          invitation_message?: string | null
          responded_at?: string | null
          status?: string | null
          to_org_id: string
        }
        Update: {
          blueprint_id?: string
          created_at?: string | null
          expires_at?: string
          from_org_id?: string
          id?: string
          invitation_message?: string | null
          responded_at?: string | null
          status?: string | null
          to_org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_invitations_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_invitations_from_org_id_fkey"
            columns: ["from_org_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_invitations_to_org_id_fkey"
            columns: ["to_org_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_members: {
        Row: {
          account_id: string
          collaboration_id: string
          id: string
          joined_at: string | null
          permissions: Json | null
          role: string | null
        }
        Insert: {
          account_id: string
          collaboration_id: string
          id?: string
          joined_at?: string | null
          permissions?: Json | null
          role?: string | null
        }
        Update: {
          account_id?: string
          collaboration_id?: string
          id?: string
          joined_at?: string | null
          permissions?: Json | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_members_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_members_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "organization_collaborations"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          attachments: Json | null
          author_id: string
          commentable_id: string
          commentable_type: string
          content: string
          created_at: string | null
          edited_at: string | null
          id: string
          is_edited: boolean | null
          mentions: Json | null
          parent_comment_id: string | null
        }
        Insert: {
          attachments?: Json | null
          author_id: string
          commentable_id: string
          commentable_type: string
          content: string
          created_at?: string | null
          edited_at?: string | null
          id?: string
          is_edited?: boolean | null
          mentions?: Json | null
          parent_comment_id?: string | null
        }
        Update: {
          attachments?: Json | null
          author_id?: string
          commentable_id?: string
          commentable_type?: string
          content?: string
          created_at?: string | null
          edited_at?: string | null
          id?: string
          is_edited?: boolean | null
          mentions?: Json | null
          parent_comment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_reports: {
        Row: {
          blueprint_id: string
          branch_id: string | null
          created_at: string | null
          equipment_used: string | null
          id: string
          issues_encountered: string | null
          materials_used: string | null
          progress_notes: string | null
          report_date: string
          reported_by: string
          task_id: string
          updated_at: string | null
          weather_info: Json | null
          work_description: string
          worker_count: number | null
        }
        Insert: {
          blueprint_id: string
          branch_id?: string | null
          created_at?: string | null
          equipment_used?: string | null
          id?: string
          issues_encountered?: string | null
          materials_used?: string | null
          progress_notes?: string | null
          report_date: string
          reported_by: string
          task_id: string
          updated_at?: string | null
          weather_info?: Json | null
          work_description: string
          worker_count?: number | null
        }
        Update: {
          blueprint_id?: string
          branch_id?: string | null
          created_at?: string | null
          equipment_used?: string | null
          id?: string
          issues_encountered?: string | null
          materials_used?: string | null
          progress_notes?: string | null
          report_date?: string
          reported_by?: string
          task_id?: string
          updated_at?: string | null
          weather_info?: Json | null
          work_description?: string
          worker_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_reports_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_reports_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "blueprint_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_reports_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_reports_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      document_thumbnails: {
        Row: {
          document_id: string
          file_size: number
          generated_at: string | null
          height: number
          id: string
          storage_path: string
          thumbnail_size: string
          width: number
        }
        Insert: {
          document_id: string
          file_size: number
          generated_at?: string | null
          height: number
          id?: string
          storage_path: string
          thumbnail_size: string
          width: number
        }
        Update: {
          document_id?: string
          file_size?: number
          generated_at?: string | null
          height?: number
          id?: string
          storage_path?: string
          thumbnail_size?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_thumbnails_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          change_description: string | null
          checksum: string | null
          created_at: string | null
          created_by: string
          document_id: string
          file_name: string
          file_size: number
          id: string
          storage_path: string
          version_number: number
        }
        Insert: {
          change_description?: string | null
          checksum?: string | null
          created_at?: string | null
          created_by: string
          document_id: string
          file_name: string
          file_size: number
          id?: string
          storage_path: string
          version_number: number
        }
        Update: {
          change_description?: string | null
          checksum?: string | null
          created_at?: string | null
          created_by?: string
          document_id?: string
          file_name?: string
          file_size?: number
          id?: string
          storage_path?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          checksum: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          is_public: boolean | null
          metadata: Json | null
          mime_type: string
          permanent_delete_at: string | null
          soft_deleted_at: string | null
          storage_bucket: string | null
          storage_path: string
          upload_source: string | null
          uploaded_at: string | null
          uploader_id: string
        }
        Insert: {
          checksum?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          mime_type: string
          permanent_delete_at?: string | null
          soft_deleted_at?: string | null
          storage_bucket?: string | null
          storage_path: string
          upload_source?: string | null
          uploaded_at?: string | null
          uploader_id: string
        }
        Update: {
          checksum?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          mime_type?: string
          permanent_delete_at?: string | null
          soft_deleted_at?: string | null
          storage_bucket?: string | null
          storage_path?: string
          upload_source?: string | null
          uploaded_at?: string | null
          uploader_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          flag_key: string
          flag_name: string
          id: string
          is_enabled: boolean | null
          rollout_percentage: number | null
          start_date: string | null
          target_accounts: Json | null
          target_organizations: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          flag_key: string
          flag_name: string
          id?: string
          is_enabled?: boolean | null
          rollout_percentage?: number | null
          start_date?: string | null
          target_accounts?: Json | null
          target_organizations?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          flag_key?: string
          flag_name?: string
          id?: string
          is_enabled?: boolean | null
          rollout_percentage?: number | null
          start_date?: string | null
          target_accounts?: Json | null
          target_organizations?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_flags_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_photos: {
        Row: {
          caption: string | null
          document_id: string
          id: string
          inspection_id: string
          photo_type: string | null
          sequence_order: number | null
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          caption?: string | null
          document_id: string
          id?: string
          inspection_id: string
          photo_type?: string | null
          sequence_order?: number | null
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          caption?: string | null
          document_id?: string
          id?: string
          inspection_id?: string
          photo_type?: string | null
          sequence_order?: number | null
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_photos_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_photos_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          acceptance_criteria: string | null
          completed_at: string | null
          corrective_actions: string | null
          defects_found: Json | null
          findings: string | null
          id: string
          inspected_at: string | null
          inspection_items: Json
          inspection_type: string | null
          inspector_id: string
          qc_id: string | null
          responsibility_transferred: boolean | null
          status: string | null
          task_id: string
          transfer_date: string | null
        }
        Insert: {
          acceptance_criteria?: string | null
          completed_at?: string | null
          corrective_actions?: string | null
          defects_found?: Json | null
          findings?: string | null
          id?: string
          inspected_at?: string | null
          inspection_items: Json
          inspection_type?: string | null
          inspector_id: string
          qc_id?: string | null
          responsibility_transferred?: boolean | null
          status?: string | null
          task_id: string
          transfer_date?: string | null
        }
        Update: {
          acceptance_criteria?: string | null
          completed_at?: string | null
          corrective_actions?: string | null
          defects_found?: Json | null
          findings?: string | null
          id?: string
          inspected_at?: string | null
          inspection_items?: Json
          inspection_type?: string | null
          inspector_id?: string
          qc_id?: string | null
          responsibility_transferred?: boolean | null
          status?: string | null
          task_id?: string
          transfer_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspections_inspector_id_fkey"
            columns: ["inspector_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_qc_id_fkey"
            columns: ["qc_id"]
            isOneToOne: false
            referencedRelation: "quality_checks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string
          assignee_id: string
          assignment_note: string | null
          id: string
          issue_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by: string
          assignee_id: string
          assignment_note?: string | null
          id?: string
          issue_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string
          assignee_id?: string
          assignment_note?: string | null
          id?: string
          issue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_assignments_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_assignments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_photos: {
        Row: {
          caption: string | null
          document_id: string
          id: string
          issue_id: string
          photo_type: string | null
          sequence_order: number | null
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          caption?: string | null
          document_id: string
          id?: string
          issue_id: string
          photo_type?: string | null
          sequence_order?: number | null
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          caption?: string | null
          document_id?: string
          id?: string
          issue_id?: string
          photo_type?: string | null
          sequence_order?: number | null
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_photos_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_photos_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_sync_logs: {
        Row: {
          id: string
          issue_id: string
          source_branch_id: string | null
          sync_data: Json | null
          sync_type: string | null
          synced_at: string | null
          synced_by: string | null
          target_blueprint_id: string
        }
        Insert: {
          id?: string
          issue_id: string
          source_branch_id?: string | null
          sync_data?: Json | null
          sync_type?: string | null
          synced_at?: string | null
          synced_by?: string | null
          target_blueprint_id: string
        }
        Update: {
          id?: string
          issue_id?: string
          source_branch_id?: string | null
          sync_data?: Json | null
          sync_type?: string | null
          synced_at?: string | null
          synced_by?: string | null
          target_blueprint_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_sync_logs_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_sync_logs_source_branch_id_fkey"
            columns: ["source_branch_id"]
            isOneToOne: false
            referencedRelation: "blueprint_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_sync_logs_synced_by_fkey"
            columns: ["synced_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_sync_logs_target_blueprint_id_fkey"
            columns: ["target_blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          blueprint_id: string
          branch_id: string | null
          closed_at: string | null
          description: string
          id: string
          issue_type: string | null
          priority: string | null
          reported_at: string | null
          reported_by: string
          resolution_note: string | null
          resolved_at: string | null
          severity: string | null
          status: string | null
          synced_to_main: boolean | null
          task_id: string | null
          title: string
        }
        Insert: {
          blueprint_id: string
          branch_id?: string | null
          closed_at?: string | null
          description: string
          id?: string
          issue_type?: string | null
          priority?: string | null
          reported_at?: string | null
          reported_by: string
          resolution_note?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          synced_to_main?: boolean | null
          task_id?: string | null
          title: string
        }
        Update: {
          blueprint_id?: string
          branch_id?: string | null
          closed_at?: string | null
          description?: string
          id?: string
          issue_type?: string | null
          priority?: string | null
          reported_at?: string | null
          reported_by?: string
          resolution_note?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          synced_to_main?: boolean | null
          task_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "issues_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "blueprint_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_rules: {
        Row: {
          account_id: string
          channel: string
          created_at: string | null
          frequency: string | null
          id: string
          is_enabled: boolean | null
          notification_type: string
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          updated_at: string | null
        }
        Insert: {
          account_id: string
          channel: string
          created_at?: string | null
          frequency?: string | null
          id?: string
          is_enabled?: boolean | null
          notification_type: string
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          channel?: string
          created_at?: string | null
          frequency?: string | null
          id?: string
          is_enabled?: boolean | null
          notification_type?: string
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_rules_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_subscriptions: {
        Row: {
          account_id: string
          id: string
          subscribable_id: string
          subscribable_type: string
          subscribed_at: string | null
          subscription_level: string | null
        }
        Insert: {
          account_id: string
          id?: string
          subscribable_id: string
          subscribable_type: string
          subscribed_at?: string | null
          subscription_level?: string | null
        }
        Update: {
          account_id?: string
          id?: string
          subscribable_id?: string
          subscribable_type?: string
          subscribed_at?: string | null
          subscription_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          content: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          notification_type: string
          priority: string | null
          read_at: string | null
          recipient_id: string
          related_id: string | null
          related_type: string | null
          sender_id: string | null
          title: string
        }
        Insert: {
          action_url?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          notification_type: string
          priority?: string | null
          read_at?: string | null
          recipient_id: string
          related_id?: string | null
          related_type?: string | null
          sender_id?: string | null
          title: string
        }
        Update: {
          action_url?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          notification_type?: string
          priority?: string | null
          read_at?: string | null
          recipient_id?: string
          related_id?: string | null
          related_type?: string | null
          sender_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_collaborations: {
        Row: {
          blueprint_id: string
          collaboration_type: string | null
          collaborator_org_id: string
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string | null
          id: string
          notes: string | null
          owner_org_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          blueprint_id: string
          collaboration_type?: string | null
          collaborator_org_id: string
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          owner_org_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          blueprint_id?: string
          collaboration_type?: string | null
          collaborator_org_id?: string
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          owner_org_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_collaborations_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_collaborations_collaborator_org_id_fkey"
            columns: ["collaborator_org_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_collaborations_owner_org_id_fkey"
            columns: ["owner_org_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_schedules: {
        Row: {
          account_id: string | null
          blueprint_id: string | null
          branch_id: string | null
          created_at: string | null
          created_by: string
          end_time: string | null
          id: string
          notes: string | null
          organization_id: string
          schedule_date: string
          start_time: string | null
          team_id: string | null
          updated_at: string | null
          weather_info: Json | null
        }
        Insert: {
          account_id?: string | null
          blueprint_id?: string | null
          branch_id?: string | null
          created_at?: string | null
          created_by: string
          end_time?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          schedule_date: string
          start_time?: string | null
          team_id?: string | null
          updated_at?: string | null
          weather_info?: Json | null
        }
        Update: {
          account_id?: string | null
          blueprint_id?: string | null
          branch_id?: string | null
          created_at?: string | null
          created_by?: string
          end_time?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          schedule_date?: string
          start_time?: string | null
          team_id?: string | null
          updated_at?: string | null
          weather_info?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_schedules_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_schedules_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_schedules_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "blueprint_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_schedules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_schedules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_schedules_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          is_system_permission: boolean | null
          name: string
          resource: string
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_system_permission?: boolean | null
          name: string
          resource: string
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_system_permission?: boolean | null
          name?: string
          resource?: string
        }
        Relationships: []
      }
      personal_todos: {
        Row: {
          account_id: string
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          related_id: string | null
          related_type: string | null
          status: string | null
          title: string
          todo_type: string
          updated_at: string | null
        }
        Insert: {
          account_id: string
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          related_id?: string | null
          related_type?: string | null
          status?: string | null
          title: string
          todo_type: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          related_id?: string | null
          related_type?: string | null
          status?: string | null
          title?: string
          todo_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_todos_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_tracking: {
        Row: {
          blueprint_id: string
          branch_id: string | null
          budget_spent: number | null
          budget_variance: number | null
          calculated_at: string | null
          completed_tasks: number | null
          completion_percentage: number | null
          id: string
          in_progress_tasks: number | null
          overdue_tasks: number | null
          pending_tasks: number | null
          quality_score: number | null
          safety_incidents: number | null
          schedule_variance_days: number | null
          total_tasks: number | null
          tracking_date: string
        }
        Insert: {
          blueprint_id: string
          branch_id?: string | null
          budget_spent?: number | null
          budget_variance?: number | null
          calculated_at?: string | null
          completed_tasks?: number | null
          completion_percentage?: number | null
          id?: string
          in_progress_tasks?: number | null
          overdue_tasks?: number | null
          pending_tasks?: number | null
          quality_score?: number | null
          safety_incidents?: number | null
          schedule_variance_days?: number | null
          total_tasks?: number | null
          tracking_date: string
        }
        Update: {
          blueprint_id?: string
          branch_id?: string | null
          budget_spent?: number | null
          budget_variance?: number | null
          calculated_at?: string | null
          completed_tasks?: number | null
          completion_percentage?: number | null
          id?: string
          in_progress_tasks?: number | null
          overdue_tasks?: number | null
          pending_tasks?: number | null
          quality_score?: number | null
          safety_incidents?: number | null
          schedule_variance_days?: number | null
          total_tasks?: number | null
          tracking_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_tracking_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_tracking_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "blueprint_branches"
            referencedColumns: ["id"]
          },
        ]
      }
      pull_requests: {
        Row: {
          blueprint_id: string
          branch_id: string
          changes_summary: Json | null
          description: string | null
          id: string
          merged_at: string | null
          merged_by: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
          submitted_by: string
          title: string
        }
        Insert: {
          blueprint_id: string
          branch_id: string
          changes_summary?: Json | null
          description?: string | null
          id?: string
          merged_at?: string | null
          merged_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          submitted_by: string
          title: string
        }
        Update: {
          blueprint_id?: string
          branch_id?: string
          changes_summary?: Json | null
          description?: string | null
          id?: string
          merged_at?: string | null
          merged_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          submitted_by?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "pull_requests_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pull_requests_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "blueprint_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pull_requests_merged_by_fkey"
            columns: ["merged_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pull_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pull_requests_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      qc_photos: {
        Row: {
          caption: string | null
          document_id: string
          id: string
          photo_type: string | null
          qc_id: string
          sequence_order: number | null
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          caption?: string | null
          document_id: string
          id?: string
          photo_type?: string | null
          qc_id: string
          sequence_order?: number | null
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          caption?: string | null
          document_id?: string
          id?: string
          photo_type?: string | null
          qc_id?: string
          sequence_order?: number | null
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "qc_photos_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qc_photos_qc_id_fkey"
            columns: ["qc_id"]
            isOneToOne: false
            referencedRelation: "quality_checks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qc_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_checks: {
        Row: {
          check_items: Json
          check_type: string | null
          checked_at: string | null
          completed_at: string | null
          findings: string | null
          id: string
          inspector_id: string
          recommendations: string | null
          staging_id: string | null
          status: string | null
          task_id: string
        }
        Insert: {
          check_items: Json
          check_type?: string | null
          checked_at?: string | null
          completed_at?: string | null
          findings?: string | null
          id?: string
          inspector_id: string
          recommendations?: string | null
          staging_id?: string | null
          status?: string | null
          task_id: string
        }
        Update: {
          check_items?: Json
          check_type?: string | null
          checked_at?: string | null
          completed_at?: string | null
          findings?: string | null
          id?: string
          inspector_id?: string
          recommendations?: string | null
          staging_id?: string | null
          status?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quality_checks_inspector_id_fkey"
            columns: ["inspector_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quality_checks_staging_id_fkey"
            columns: ["staging_id"]
            isOneToOne: false
            referencedRelation: "task_staging"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quality_checks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      report_photos: {
        Row: {
          caption: string | null
          document_id: string
          id: string
          photo_type: string | null
          report_id: string
          sequence_order: number | null
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          caption?: string | null
          document_id: string
          id?: string
          photo_type?: string | null
          report_id: string
          sequence_order?: number | null
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          caption?: string | null
          document_id?: string
          id?: string
          photo_type?: string | null
          report_id?: string
          sequence_order?: number | null
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_photos_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_photos_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "daily_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_system_role: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          scope_id: string | null
          setting_key: string
          setting_type: string | null
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          scope_id?: string | null
          setting_key: string
          setting_type?: string | null
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          scope_id?: string | null
          setting_key?: string
          setting_type?: string | null
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      task_assignments: {
        Row: {
          accepted_at: string | null
          assigned_at: string | null
          assigned_by: string
          assignee_id: string
          assignee_type: string
          assignment_note: string | null
          id: string
          task_id: string
        }
        Insert: {
          accepted_at?: string | null
          assigned_at?: string | null
          assigned_by: string
          assignee_id: string
          assignee_type: string
          assignment_note?: string | null
          id?: string
          task_id: string
        }
        Update: {
          accepted_at?: string | null
          assigned_at?: string | null
          assigned_by?: string
          assignee_id?: string
          assignee_type?: string
          assignment_note?: string | null
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_assignments_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_assignments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_dependencies: {
        Row: {
          created_at: string | null
          dependency_type: string | null
          depends_on_task_id: string
          id: string
          lag_days: number | null
          task_id: string
        }
        Insert: {
          created_at?: string | null
          dependency_type?: string | null
          depends_on_task_id: string
          id?: string
          lag_days?: number | null
          task_id: string
        }
        Update: {
          created_at?: string | null
          dependency_type?: string | null
          depends_on_task_id?: string
          id?: string
          lag_days?: number | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_depends_on_task_id_fkey"
            columns: ["depends_on_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_lists: {
        Row: {
          account_id: string
          added_at: string | null
          id: string
          list_type: string | null
          task_id: string
        }
        Insert: {
          account_id: string
          added_at?: string | null
          id?: string
          list_type?: string | null
          task_id: string
        }
        Update: {
          account_id?: string
          added_at?: string | null
          id?: string
          list_type?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_lists_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_lists_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_staging: {
        Row: {
          can_withdraw: boolean | null
          confirmed_at: string | null
          expires_at: string
          id: string
          notes: string | null
          photos: Json | null
          staging_data: Json
          submitted_at: string | null
          submitted_by: string
          task_id: string
          withdrawn_at: string | null
        }
        Insert: {
          can_withdraw?: boolean | null
          confirmed_at?: string | null
          expires_at?: string
          id?: string
          notes?: string | null
          photos?: Json | null
          staging_data: Json
          submitted_at?: string | null
          submitted_by: string
          task_id: string
          withdrawn_at?: string | null
        }
        Update: {
          can_withdraw?: boolean | null
          confirmed_at?: string | null
          expires_at?: string
          id?: string
          notes?: string | null
          photos?: Json | null
          staging_data?: Json
          submitted_at?: string | null
          submitted_by?: string
          task_id?: string
          withdrawn_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_staging_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_staging_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_templates: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          organization_id: string
          template_data: Json
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          organization_id: string
          template_data: Json
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          organization_id?: string
          template_data?: Json
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "task_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_end_date: string | null
          actual_hours: number | null
          actual_start_date: string | null
          blueprint_id: string
          branch_id: string | null
          contractor_fields: Json | null
          created_at: string | null
          created_by: string
          description: string | null
          estimated_hours: number | null
          id: string
          parent_task_id: string | null
          planned_end_date: string | null
          planned_start_date: string | null
          priority: string | null
          progress_percentage: number | null
          sequence_order: number | null
          status: string | null
          task_type: string | null
          title: string
          tree_level: number | null
          tree_path: unknown
          updated_at: string | null
        }
        Insert: {
          actual_end_date?: string | null
          actual_hours?: number | null
          actual_start_date?: string | null
          blueprint_id: string
          branch_id?: string | null
          contractor_fields?: Json | null
          created_at?: string | null
          created_by: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          parent_task_id?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          priority?: string | null
          progress_percentage?: number | null
          sequence_order?: number | null
          status?: string | null
          task_type?: string | null
          title: string
          tree_level?: number | null
          tree_path?: unknown
          updated_at?: string | null
        }
        Update: {
          actual_end_date?: string | null
          actual_hours?: number | null
          actual_start_date?: string | null
          blueprint_id?: string
          branch_id?: string | null
          contractor_fields?: Json | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          parent_task_id?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          priority?: string | null
          progress_percentage?: number | null
          sequence_order?: number | null
          status?: string | null
          task_type?: string | null
          title?: string
          tree_level?: number | null
          tree_path?: unknown
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "blueprint_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          account_id: string
          id: string
          joined_at: string | null
          role: string | null
          team_id: string
        }
        Insert: {
          account_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          team_id: string
        }
        Update: {
          account_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          organization_id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      todo_status_tracking: {
        Row: {
          change_note: string | null
          changed_at: string | null
          changed_by: string | null
          from_status: string | null
          id: string
          to_status: string
          todo_id: string
        }
        Insert: {
          change_note?: string | null
          changed_at?: string | null
          changed_by?: string | null
          from_status?: string | null
          id?: string
          to_status: string
          todo_id: string
        }
        Update: {
          change_note?: string | null
          changed_at?: string | null
          changed_by?: string | null
          from_status?: string | null
          id?: string
          to_status?: string
          todo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_status_tracking_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_status_tracking_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "personal_todos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          account_id: string
          blueprint_id: string | null
          branch_id: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          role_id: string
        }
        Insert: {
          account_id: string
          blueprint_id?: string | null
          branch_id?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role_id: string
        }
        Update: {
          account_id?: string
          blueprint_id?: string | null
          branch_id?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "blueprint_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_cache: {
        Row: {
          api_source: string | null
          expires_at: string
          fetched_at: string | null
          forecast_date: string
          id: string
          location: string
          weather_data: Json
        }
        Insert: {
          api_source?: string | null
          expires_at: string
          fetched_at?: string | null
          forecast_date: string
          id?: string
          location: string
          weather_data: Json
        }
        Update: {
          api_source?: string | null
          expires_at?: string
          fetched_at?: string | null
          forecast_date?: string
          id?: string
          location?: string
          weather_data?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      text2ltree: { Args: { "": string }; Returns: unknown }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
