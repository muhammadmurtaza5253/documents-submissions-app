import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  useTheme,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DateGroup } from "./types";
import { ActivityList } from "./ActivityList";
import { TodayActivityInput } from "./TodayActivityInput";
import { formatDateKey } from "./helper";
import { RawActivity } from "./types";

interface DateGroupAccordionProps {
  group: DateGroup;
  isToday: boolean;
  formatDisplayDate: (date: Date) => string;
  onActivityAdded?: (activity: RawActivity) => void;
}

export const DateGroupAccordion = ({
  group,
  isToday,
  formatDisplayDate,
  onActivityAdded,
}: DateGroupAccordionProps) => {
  const theme = useTheme();

  return (
    <Accordion
      key={formatDateKey(group.date)}
      defaultExpanded={isToday}
      sx={{
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: 3,
        overflow: "hidden",
        "&:before": {
          display: "none",
        },
        "&.Mui-expanded": {
          margin: "16px 0",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderRadius: isToday ? "12px 12px 0 0" : "12px",
          "&.Mui-expanded": {
            borderRadius: "12px 12px 0 0",
          },
          "& .MuiAccordionSummary-content": {
            alignItems: "center",
            gap: 1.5,
          },
        }}
      >
        <CalendarTodayIcon />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {formatDisplayDate(group.date)}
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        {/* Activities for this date */}
        <ActivityList activities={group.activities} />

        {/* Input Section for Current Date */}
        {isToday && onActivityAdded && (
          <TodayActivityInput
            onSend={onActivityAdded}
            hasActivities={group.activities.length > 0}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

