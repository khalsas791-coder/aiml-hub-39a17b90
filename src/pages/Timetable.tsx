import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NetworkBackground from '@/components/NetworkBackground';
import ThemeToggle from '@/components/ThemeToggle';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import appLogo from '@/assets/app-logo.png';
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react';

interface ClassSlot {
  subject: string;
  teacher: string;
  type?: 'regular' | 'lab';
}

interface DaySchedule {
  day: string;
  slots: (ClassSlot | null)[];
}

const timeSlots = [
  '09:00 AM - 09:55 AM',
  '09:55 AM - 10:50 AM',
  '10:50 AM - 11:10 AM', // Break
  '11:10 AM - 12:05 PM',
  '12:05 PM - 01:00 PM',
  '01:00 PM - 02:00 PM', // Lunch
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
];

// CSE(AIML) Branch Timetable
const cseAimlTimetable: DaySchedule[] = [
  {
    day: 'Monday',
    slots: [
      { subject: 'DDCO / JAVA', teacher: 'KG / RP', type: 'lab' },
      null,
      null, // Tea Break
      { subject: 'DDCO', teacher: 'SM' },
      { subject: 'M3', teacher: 'JM' },
      null, // Lunch
      { subject: 'DSA', teacher: 'NK' },
      { subject: 'OS', teacher: 'DJ' },
      { subject: 'JAVA', teacher: 'RP' },
    ],
  },
  {
    day: 'Tuesday',
    slots: [
      { subject: 'M3', teacher: 'JM' },
      { subject: 'DDCO', teacher: 'SM' },
      null, // Tea Break
      { subject: 'JAVA', teacher: 'RP' },
      { subject: 'OS', teacher: 'DJ' },
      null, // Lunch
      { subject: 'SCR', teacher: 'KG' },
      { subject: 'NSS', teacher: 'NM' },
      { subject: 'NSS', teacher: 'NM' },
    ],
  },
  {
    day: 'Wednesday',
    slots: [
      { subject: 'M3', teacher: 'JM' },
      { subject: 'DSA', teacher: 'NK' },
      null, // Tea Break
      { subject: 'DSA LAB', teacher: 'JKA', type: 'lab' },
      { subject: 'DSA LAB', teacher: 'JKA', type: 'lab' },
      null, // Lunch
      { subject: 'JAVA', teacher: 'RP' },
      { subject: 'OS', teacher: 'NK' },
      { subject: 'LIB', teacher: '' },
    ],
  },
  {
    day: 'Thursday',
    slots: [
      { subject: 'DDCO / JAVA', teacher: 'KG / RP', type: 'lab' },
      null,
      null, // Tea Break
      { subject: 'M3', teacher: 'JM' },
      { subject: 'JAVA', teacher: 'RP' },
      null, // Lunch
      { subject: 'DDCO', teacher: 'SM' },
      { subject: 'DSA', teacher: 'NK' },
      null,
    ],
  },
  {
    day: 'Friday',
    slots: [
      { subject: 'DDCO', teacher: 'SM' },
      { subject: 'DSA', teacher: 'NK' },
      null, // Tea Break
      { subject: 'OS', teacher: 'DJ' },
      { subject: 'SCR', teacher: 'KG' },
      null, // Lunch
      { subject: 'M3', teacher: 'JM' },
      { subject: 'Git / OS', teacher: 'NS / NM', type: 'lab' },
      null,
    ],
  },
  {
    day: 'Saturday',
    slots: [
      { subject: 'Git / OS', teacher: 'NS / NM', type: 'lab' },
      null,
      null, // Tea Break
      null,
      null,
      null, // Lunch
      null,
      null,
      null,
    ],
  },
];

// AIML Branch Timetable (Empty - To be updated)
const aimlTimetable: DaySchedule[] = [
  {
    day: 'Monday',
    slots: [null, null, null, null, null, null, null, null, null],
  },
  {
    day: 'Tuesday',
    slots: [null, null, null, null, null, null, null, null, null],
  },
  {
    day: 'Wednesday',
    slots: [null, null, null, null, null, null, null, null, null],
  },
  {
    day: 'Thursday',
    slots: [null, null, null, null, null, null, null, null, null],
  },
  {
    day: 'Friday',
    slots: [null, null, null, null, null, null, null, null, null],
  },
  {
    day: 'Saturday',
    slots: [null, null, null, null, null, null, null, null, null],
  },
];

const getSlotStyle = (slot: ClassSlot | null, index: number) => {
  if (index === 2) return 'bg-amber-500/20 text-amber-600 dark:text-amber-400';
  if (index === 5) return 'bg-sky-500/20 text-sky-600 dark:text-sky-400';
  if (!slot) return 'bg-muted/30 text-muted-foreground';
  if (slot.type === 'lab') return 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400';
  return 'bg-primary/10 text-foreground';
};

const TimetableTable = ({ timetableData }: { timetableData: DaySchedule[] }) => (
  <>
    {/* Desktop Table View */}
    <Card className="hidden lg:block border shadow-lg dark:border-0 dark:glass dark:glow-border mb-8">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableHead className="font-bold text-foreground min-w-[100px]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time / Day
                  </div>
                </TableHead>
                {timeSlots.map((time, index) => (
                  <TableHead 
                    key={index} 
                    className={`text-center min-w-[120px] text-xs font-semibold ${
                      index === 2 ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 
                      index === 5 ? 'bg-sky-500/20 text-sky-600 dark:text-sky-400' : 
                      'text-foreground'
                    }`}
                  >
                    {index === 2 ? 'TEA BREAK' : index === 5 ? 'LUNCH' : time}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {timetableData.map((dayData) => (
                <TableRow key={dayData.day} className="hover:bg-muted/30">
                  <TableCell className="font-bold text-primary bg-primary/5">
                    {dayData.day.toUpperCase()}
                  </TableCell>
                  {dayData.slots.map((slot, index) => (
                    <TableCell 
                      key={index} 
                      className={`text-center p-2 ${getSlotStyle(slot, index)}`}
                    >
                      {index === 2 ? (
                        <span className="text-xs font-medium">Break</span>
                      ) : index === 5 ? (
                        <span className="text-xs font-medium">Lunch</span>
                      ) : slot ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-xs">{slot.subject}</span>
                          {slot.teacher && (
                            <span className="text-[10px] opacity-70">{slot.teacher}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs">-</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    {/* Mobile Card View */}
    <div className="lg:hidden space-y-4">
      {timetableData.map((dayData) => (
        <Card key={dayData.day} className="border shadow-md dark:border-0 dark:glass">
          <CardHeader className="pb-2 bg-primary/10">
            <CardTitle className="text-lg text-primary">{dayData.day}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {dayData.slots.map((slot, index) => {
              if (index === 2) {
                return (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-amber-500/20">
                    <span className="text-xs text-muted-foreground">{timeSlots[index]}</span>
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Tea Break</span>
                  </div>
                );
              }
              if (index === 5) {
                return (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-sky-500/20">
                    <span className="text-xs text-muted-foreground">{timeSlots[index]}</span>
                    <span className="text-xs font-medium text-sky-600 dark:text-sky-400">Lunch Break</span>
                  </div>
                );
              }
              if (!slot) return null;
              return (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    slot.type === 'lab' ? 'bg-cyan-500/10' : 'bg-muted/50'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-foreground text-sm">{slot.subject}</p>
                    {slot.teacher && (
                      <p className="text-xs text-muted-foreground">{slot.teacher}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{timeSlots[index]}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  </>
);

export default function Timetable() {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState<'cse-aiml' | 'aiml'>('cse-aiml');

  return (
    <div className="min-h-screen relative">
      <NetworkBackground />
      
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border dark:glass-strong dark:border-0">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <img src={appLogo} alt="AIML Logo" className="w-12 h-12 object-contain" />
            <span className="text-lg font-semibold text-foreground hidden sm:block">AIML Portal</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserProfileDropdown />
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <CalendarDays className="w-8 h-8 text-primary" />
              Class Timetable
            </h1>
            <p className="text-muted-foreground text-sm">Academic Year 2025-26 | 3rd Semester</p>
          </div>
        </div>

        {/* Branch Selection Tabs */}
        <Tabs value={selectedBranch} onValueChange={(v) => setSelectedBranch(v as 'cse-aiml' | 'aiml')} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="cse-aiml" className="font-semibold">CSE (AIML)</TabsTrigger>
            <TabsTrigger value="aiml" className="font-semibold">AIML</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/20"></div>
            <span className="text-sm text-muted-foreground">Regular Class</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-cyan-500/20"></div>
            <span className="text-sm text-muted-foreground">Lab Session</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500/20"></div>
            <span className="text-sm text-muted-foreground">Tea Break</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-sky-500/20"></div>
            <span className="text-sm text-muted-foreground">Lunch Break</span>
          </div>
        </div>

        {/* Timetable Display */}
        <TimetableTable timetableData={selectedBranch === 'cse-aiml' ? cseAimlTimetable : aimlTimetable} />

        {/* Faculty Initials Legend */}
        <Card className="mt-8 border shadow-md dark:border-0 dark:glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Faculty Abbreviations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div><span className="font-semibold text-primary">M3 / JM</span> - Prof. Jyothi M</div>
              <div><span className="font-semibold text-primary">DDCO / SM</span> - Prof. Soni M</div>
              <div><span className="font-semibold text-primary">DDCOL / KG</span> - Mrs. Kaveri</div>
              <div><span className="font-semibold text-primary">OS / DJ</span> - Dr. Dayanand J</div>
              <div><span className="font-semibold text-primary">OSL / NM</span> - Ms. Namratha M</div>
              <div><span className="font-semibold text-primary">DSA / NK</span> - Prof. Nasreen Kausar</div>
              <div><span className="font-semibold text-primary">DSAL / JKA / NK</span> - Dr. Jasmineet Kaur Arora / Prof. Nasreen Kausar</div>
              <div><span className="font-semibold text-primary">JAVA / RP</span> - Prof. Rony Preetam</div>
              <div><span className="font-semibold text-primary">JAVAL / RP</span> - Prof. Rony Preetam</div>
              <div><span className="font-semibold text-primary">SCR / KG</span> - Mrs. Kaveri</div>
              <div><span className="font-semibold text-primary">Git / NS</span> - Prof. Netravati Sawale</div>
              <div><span className="font-semibold text-primary">NSS / NM</span> - Ms. Namratha M</div>
              <div><span className="font-semibold text-primary">LIB</span> - Library</div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}