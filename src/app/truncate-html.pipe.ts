import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateHtml',
  standalone: true
})
export class TruncateHtmlPipe implements PipeTransform {

  transform(value: string, limit: number): string {
    const plainText = value.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags
    if (plainText.length <= limit) {
      return value; // No need to truncate
    }
    const truncated = plainText.substring(0, limit) + '...';
    return truncated;
  }

}
