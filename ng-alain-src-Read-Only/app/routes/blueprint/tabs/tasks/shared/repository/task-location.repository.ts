import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';
import type { PhysicalLocation, SpatialRelationships } from '@models';

export interface TaskLocationData extends Record<string, unknown> {
  physical?: PhysicalLocation;
  relationships?: SpatialRelationships;
  context?: Record<string, unknown>;
}

@Injectable({
  providedIn: 'root'
})
export class TaskLocationRepository {
  private readonly supabase = inject(SupabaseService);

  async getLocationData(taskId: string): Promise<TaskLocationData | null> {
    const { data, error } = await this.supabase.client.from('blueprint_tasks').select('location_data').eq('id', taskId).maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch location data: ${error.message}`);
    }

    return ((data?.location_data as TaskLocationData | undefined) ?? null) as TaskLocationData | null;
  }

  async saveLocationData(taskId: string, locationData: TaskLocationData): Promise<void> {
    const { error } = await this.supabase.client
      .from('blueprint_tasks')
      .update({
        location_data: locationData,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);

    if (error) {
      throw new Error(`Failed to persist location data: ${error.message}`);
    }
  }

  async clearLegacyLocationData(taskId: string): Promise<void> {
    const { error } = await this.supabase.client.from('blueprint_tasks').update({ location_data: null }).eq('id', taskId);

    if (error) {
      throw new Error(`Failed to clear legacy location data: ${error.message}`);
    }
  }
}
