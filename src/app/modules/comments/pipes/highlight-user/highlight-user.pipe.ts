import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const userRegExp: RegExp = new RegExp(/@{1}[a-z]+/ig);

/**
 * Highlights ocurrences of usernames beign tagged in comments (aka @)
 * 
 * The pipe is meant to be used with a variable binding to the `[innerHTML]` property of an element, since
 * it needs to inject styled HTML code into the element in order to display the highlighted username.
 * 
 * The injected HTML code is sanitized before beign sent to the host element.
 */
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
                        ${value.match(userRegExp)?.find(item => item == text.substring(0, item.length))}
                    </span>`
                )
            ).join(' ')
        );
    }
}