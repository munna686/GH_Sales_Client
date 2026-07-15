export class Common {
  static minutesToMilliseconds(minutes: number): number {
    return minutes * 60 * 1000;
  }
  static secondsToMilliseconds(seconds: number): number {
    return seconds * 1000;
  }
  static toISOString(date: string | Date | null | undefined): string | null {
    if (!date) return null;

    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
  }

  static getMaxSequenceWorkflow(workflows: any[]): any {
    if (!workflows || workflows.length === 0) return null; 
    return workflows.reduce((prev, current) => {
      return (prev.sequenceOrder > current.sequenceOrder) ? prev : current;
    });
  }

  static combineDateAndTime(date: string, time: string): string {
    return `${date}T${time}:00`;
  }
  static setWorkflower(currentUser: any): string {
    return currentUser?.userName + ' ,' +currentUser?.designation + ' ,' + currentUser?.department || ''
  }

  static getYears(): { label: string, value: number }[] {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 5; year <= currentYear + 2; year++) {
      years.push({ label: year.toString(), value: year });
    }
    return years;
  }

}
