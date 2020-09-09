import { Component, OnInit } from '@angular/core';

export interface Installer {
  name: string;
  score: number;
}

export interface Day {
  date: Date;
  status?: number;
  installers?: Installer[];
  unavailables?: Installer[];
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  schedule: any;
  calendar: Day[];
  selectedDate: Date;
  firstDay: number;
  rangeMode: boolean;
  installerView: boolean;
  availableView: boolean = true;
  idx: number = 0;
  installer: Installer;

  ngOnInit(): void {
    //this.setLocal();
    this.setCalendar();
  }

  setLocal(): void {
    !localStorage.getItem('schedules') ? 
    localStorage.setItem('schedules', JSON.stringify([])) : 
    this.schedule = JSON.parse(localStorage.getItem('shedules'))[0];
  }

  initMonth(date: Date): Day[] {
    let i: number = 1;
    const len: number = date.getDate(),
    arr: Day[] = [];
    console.log(len);
    for(; i <= len; i++) arr.push({date: new Date(date.getFullYear(), date.getMonth(), i)});
    return arr;
  }

  setCalendar(): void {
    const date: Date = new Date(),
    arr: Day[] = [];
    let i: number = 0,
    month: number = date.getMonth();
    for(; i < 13; i++) {
      let day: number = !i ? date.getDate() : 1;
      const len: number = Number(new Date(date.getFullYear(), month+1, 0).getDate());
      for(; day <= len; day++) arr.push({ date: new Date(date.getFullYear(), month, day)});
      month+=1;
    }
    this.selectedDate = arr[0].date;
    this.firstDay = date.getDay();
    this.calendar = arr;
  }

  getDay(date: Date): number {
    return date.getDate();
  }

  selectDay(date: Date, idx: number): void {
    if(idx === this.idx) return;
    if(this.installerView && this.calendar[idx].status === undefined || this.calendar[idx].status === 2) this.installerView = false;
    this.selectedDate = date;
    this.idx = idx;
    console.log(this.idx);
  }

  getSelectedDate(): string {
    return this.selectedDate.toLocaleDateString('default', {month: 'long', day: 'numeric', year: 'numeric'});
  }

  initRange(): void {
    this.rangeMode = !this.rangeMode;
  }

  setInstallers(): Installer[] {
    let i: number = 0;
    const len: number = Math.floor(Math.random() * 15) + 1,
    arr: Installer[] = [];
    for(; i < len; i++) arr.push({
      name: 'Crew ' + Math.floor(Math.random() * 1000),
      score: Math.floor(50 + (Math.random() * 50))
    });
    arr.sort((a, b) => b.score - a.score);
    return arr;
  }

  findAvailable(): void {
    let i: number = this.idx,
    status: number;
    const len: number = i + (!this.rangeMode ? 1 : 7);
    for(; i < len; i++) {
      status = Math.floor(Math.random() * 3);
      this.calendar[i].status = status;
      if(status !== 2) {
        this.calendar[i].installers = this.setInstallers();
        this.calendar[i].unavailables = this.setInstallers();
      } 
    }
    if(this.rangeMode) this.rangeMode = false;
  }

  getAvailability(): string {
    const status = this.calendar[this.idx].status;
    return !status ? 'OPEN' : status < 2 ? 'LOCKED - Please consult your manager before scheduling.' : 'CLOSED';
  }

  initView(view: boolean): void {
    if(view && (this.calendar[this.idx].status === undefined || this.calendar[this.idx].status === 2)) return;
    this.installerView = view;
  }

  initAvailable(view: boolean): void {
    this.availableView = view;
  }

  selectInstaller(installer: Installer): void {
    this.installer = installer;
  }

}
