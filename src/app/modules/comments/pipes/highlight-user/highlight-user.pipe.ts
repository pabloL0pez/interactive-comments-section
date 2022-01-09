import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const userRegExp: RegExp = new RegExp(/@{1}[a-z]+/i);

@Pipe({
    name: 'highlightUser',
})
export class HighlightUserPipe implements PipeTransform {

    constructor(
        private domSanitizer: DomSanitizer,
    ) {}

    transform(value: string): SafeHtml {
        return this.domSanitizer.bypassSecurityTrustHtml(
            value.split(' ').map(text => text.replace(userRegExp,
                    `<span style='color: var(--moderate-blue); font-weight: var(--weight-bold); font-size: inherit;'>
                        ${value.match(userRegExp)}
                    </span>`
                )
            ).join(' ')
        );
    }
}