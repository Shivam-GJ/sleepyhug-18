export class PerfTimer {
    startTime: number;
    lastTime: number;
    nLogs: number;
    tag?: string;

    constructor(tag?: string) {
        const time = Date.now();

        this.tag = tag;
        this.startTime = time;
        this.lastTime = time;
        this.nLogs = 0;
    }

    lap() {
        const time = Date.now();
        console.log(this.tag == null ? "" : this.tag, this.nLogs + 1, time - this.lastTime);
        this.lastTime = time;
        this.nLogs++;
    }

    end() {
        const time = Date.now();
        console.log(this.tag == null ? "" : this.tag, this.nLogs + 1, time - this.lastTime);
        console.log(this.tag == null ? "" : this.tag, `Total: ${this.nLogs}`, time - this.startTime);
    }
}
