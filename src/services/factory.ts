import { EventService } from './interfaces/EventService';
import { SupabaseEventService } from './implementations/SupabaseEventService';

// Singleton instance
const supabaseEventService = new SupabaseEventService();

export const eventService: EventService = supabaseEventService;
