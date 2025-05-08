import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon, FileText, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface LaporanFiltersProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onFilterApply: () => void;
  onPeriodChange?: (period: string) => void;
  onExport?: () => void;
  onPrint?: () => void;
}

export default function LaporanFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onFilterApply,
  onPeriodChange,
  onExport,
  onPrint
}: LaporanFiltersProps) {
  // Generate month and year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
  ];
  
  // Handle quick period change
  const handlePeriodChange = (value: string) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();
    
    switch (value) {
      case 'current-month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'last-month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'current-quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        end = new Date(today.getFullYear(), quarter * 3 + 3, 0);
        break;
      case 'current-year':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      case 'last-year':
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
      case 'custom':
        // Keep existing dates
        break;
      default:
        // Default to current month
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }
    
    if (value !== 'custom') {
      onStartDateChange(start);
      onEndDateChange(end);
      
      // Automatically apply filter if not custom
      setTimeout(() => onFilterApply(), 100);
    }
    
    if (onPeriodChange) onPeriodChange(value);
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-12">
          {/* Period Quick Select */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periode
            </label>
            <Select onValueChange={handlePeriodChange} defaultValue="current-month">
              <SelectTrigger>
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-month">Bulan Ini</SelectItem>
                <SelectItem value="last-month">Bulan Lalu</SelectItem>
                <SelectItem value="current-quarter">Kuartal Ini</SelectItem>
                <SelectItem value="current-year">Tahun Ini</SelectItem>
                <SelectItem value="last-year">Tahun Lalu</SelectItem>
                <SelectItem value="custom">Kustom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Range Pickers */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(startDate, 'dd MMMM yyyy', { locale: id })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && onStartDateChange(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Akhir
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(endDate, 'dd MMMM yyyy', { locale: id })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && onEndDateChange(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Action Buttons */}
          <div className="md:col-span-3 flex items-end gap-2">
            <Button onClick={onFilterApply} className="flex-1">
              Terapkan Filter
            </Button>
            
            {onExport && (
              <Button variant="outline" onClick={onExport}>
                <FileText className="h-4 w-4" />
              </Button>
            )}
            
            {onPrint && (
              <Button variant="outline" onClick={onPrint}>
                <Printer className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
