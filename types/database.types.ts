export interface Database {
    public: {
        Tables: {
            events: {
                Row: {
                    id: string
                    title: string
                    description: string
                    start_time: string
                    end_time?: string
                    location: string
                    website?: string
                    cost?: number | string
                    event_type: string
                    host: string
                    attendees_count: number
                }
                Insert: {
                    id?: string
                    title: string
                    description: string
                    start_time: string
                    end_time?: string
                    location: string
                    website?: string
                    cost?: number | string
                    event_type: string
                    host: string
                    attendees_count?: number
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string
                    start_time?: string
                    end_time?: string
                    location?: string
                    website?: string
                    cost?: number | string
                    event_type?: string
                    host?: string
                    attendees_count?: number
                }
            }
            event_attendees: {
                Row: {
                    id: string
                    event_id: string
                    user_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    event_id: string
                    user_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    event_id?: string
                    user_id?: string
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    name: string
                    avatar_url?: string
                    created_at: string
                }
                Insert: {
                    id: string
                    name: string
                    avatar_url?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    avatar_url?: string
                    created_at?: string
                }
            }
        }
    }
}

