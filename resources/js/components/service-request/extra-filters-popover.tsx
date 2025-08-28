import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Category } from '@/types';

interface ExtraFiltersPopoverProps {
    data: {
        search: string | null;
        category: string | null;
        city: string | null;
        created_at: string | null;
        status: string | null;
        min_price: string | null;
        max_price: string | null;
    };
    categories: Category[];
    setData: (field: string, value: string | null) => void;
    handleFilter: () => void;
}

export default function ExtraFiltersPopover({ data, categories, setData, handleFilter }: ExtraFiltersPopoverProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> More Filters</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => setData('category', value === 'all' ? null : value)} value={data.category || ''}>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Filter by Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.slug}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="created_at">Posted Date</Label>
                    <Select onValueChange={(value) => setData('created_at', value === 'all' ? null : value)} value={data.created_at || ''}>
                        <SelectTrigger id="created_at">
                            <SelectValue placeholder="Filter by Posted Date" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Time</SelectItem>
                            <SelectItem value="last_24_hours">Last 24 Hours</SelectItem>
                            <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                            <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select onValueChange={(value) => setData('status', value === 'all' ? null : value)} value={data.status || ''}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Status</SelectItem>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="canceled">Canceled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                        <Label htmlFor="min_price">Min Price</Label>
                        <Input
                            id="min_price"
                            type="number"
                            placeholder="Min"
                            value={data.min_price || ''}
                            onChange={(e) => setData('min_price', e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="max_price">Max Price</Label>
                        <Input
                            id="max_price"
                            type="number"
                            placeholder="Max"
                            value={data.max_price || ''}
                            onChange={(e) => setData('max_price', e.target.value)}
                        />
                    </div>
                </div>

                <Button onClick={handleFilter} className="w-full">Apply Filters</Button>
            </PopoverContent>
        </Popover>
    );
}
