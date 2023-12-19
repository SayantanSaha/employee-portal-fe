import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseChangedData'
  
})
export class ParseChangedDataPipe implements PipeTransform {

  transform(changedData: string, fieldName: string): string {
    try {
      const parsedData = JSON.parse(changedData);
      
      if(parsedData[fieldName]) {
        console.log(parsedData)
        return parsedData[fieldName];
      }
    } catch (error) {
      console.log(error)
    }
    return ''; 
  }

}
