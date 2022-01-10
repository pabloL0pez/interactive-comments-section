import { Pipe, PipeTransform } from '@angular/core';

const checkValues: number[] = [60, 60, 24, 7, 4, 12];
const displayValues: (string | null)[] = [null, "minute", "hour", "day", "week", "month"];

/**
 * Transforms dates into semantic timestamps relative to today's datetime.
 * 
 * The available values for displaying are the following, considering `t` as an example timestamp:
 * - `just now`, for `t` lower than 60 seconds
 * - `t minute(s) ago`, for `t` between 60 seconds and 60 minutes
 * - `t hour(s) ago`, for `t` between 60 minutes and 24 hours
 * - `t day(s) ago`, for `t` between 24 hours and 7 days
 * - `t week(s) ago`, for `t` between 7 days and 4 weeks
 * - `t month(s) ago`, for `t` between 4 weeks and 12 months
 * - `t year(s) ago`, for `t` greater than 12 months
 * 
 * In all cases the upper ranges are non inclusive.
 */
@Pipe({
    name: 'timestamp',
})
export class TimestampPipe implements PipeTransform {

    constructor() {}

    transform(value: string): string {
        let newValue: number = Math.floor((new Date().getTime() - new Date(value).getTime()) / 1000);

        for (let i = 0 ; i < checkValues.length ; i++) {
            if (newValue >= checkValues[i]) {
                newValue = Math.floor(newValue / checkValues[i]);
            } else {
                return displayValues[i] != null ? `${newValue} ${displayValues[i]}${newValue == 1 ? '' : 's'} ago` : "just now";
            }
        }

        return `${newValue} year${newValue == 1 ? '' : 's'} ago`;
    }
}
