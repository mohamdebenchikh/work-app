import { Moon, Sun, Monitor } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppearance } from '@/hooks/use-appearance';

export function ModeToggle() {

    const { appearance, updateAppearance } = useAppearance();
    const icon = appearance === "light" ? <Sun /> : appearance === "dark" ? <Moon /> : <Monitor />;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    {icon}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => updateAppearance("light")}>
                    <Sun className="mr-2" />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateAppearance("dark")}>
                    <Moon className="mr-2" />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateAppearance("system")}>
                    <Monitor className="mr-2" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

