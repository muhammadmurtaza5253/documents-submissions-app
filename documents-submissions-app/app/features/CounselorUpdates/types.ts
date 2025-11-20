export interface Activity {
  id: string;
  text: string;
  sender: "student" | "counselor";
  timestamp: Date;
  documentUrl?: string;
  documentName?: string;
}

export interface RawActivity {
  id: string;
  text: string;
  sender: string;
  dateCreated: Date;
  documentUrl?: string;
  documentName?: string;
}

export interface DateGroup {
  date: Date;
  activities: Activity[];
}
