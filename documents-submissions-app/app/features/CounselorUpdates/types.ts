export interface Message {
  message: string;
  sender: "student" | "counselor";
  date?: Date | string;
  documentUrl?: string;
  documentName?: string;
}

export interface DateGroup {
  date: Date;
  activities: Message[];
}
