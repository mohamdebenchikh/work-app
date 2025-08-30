import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format, setHours, setMinutes } from "date-fns"

interface TimePickerProps {
  value?: Date
  onChange: (date: Date) => void
  minTime?: Date
  maxTime?: Date
  interval?: number
  className?: string
  placeholder?: string
}

export function TimePicker({
  value,
  onChange,
  minTime,
  maxTime,
  interval = 30,
  className,
  placeholder = "Select a time"
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)
  
  // Generate time slots based on interval (in minutes)
  const timeSlots = React.useMemo(() => {
    const slots = []
    const startHour = minTime ? minTime.getHours() : 0
    const endHour = maxTime ? maxTime.getHours() : 23
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = setHours(setMinutes(new Date(), minute), hour)
        
        // Skip if before minTime
        if (minTime && time < minTime) continue
        // Skip if after maxTime
        if (maxTime && time > maxTime) continue
        
        slots.push(time)
      }
    }
    
    return slots
  }, [minTime, maxTime, interval])

  const handleTimeSelect = (time: Date) => {
    if (value) {
      const newDate = new Date(value)
      newDate.setHours(time.getHours(), time.getMinutes())
      onChange(newDate)
    } else {
      onChange(time)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? format(value, "h:mm aa") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 max-h-60 overflow-y-auto">
        <div className="grid grid-cols-2 gap-1">
          {timeSlots.map((time, i) => (
            <Button
              key={i}
              variant={"ghost"}
              className={cn(
                "justify-start",
                value && format(value, "HH:mm") === format(time, "HH:mm") && "bg-accent"
              )}
              onClick={() => handleTimeSelect(time)}
            >
              {format(time, "h:mm aa")}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
