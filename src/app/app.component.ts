import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  
    selectedItem:any = {};
    processedObject:any = {};

    constructor(private http:HttpClient){}

    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
     
      this.fetchItem(95);


    }


    
    fetchItem(itemID){ //fetches the XivItem Properties for the given ID

      this.http.get('https://xivapi.com/recipe/' + itemID).subscribe((response)=>{ 
          this.selectedItem = response;
          this.doTheCraftThingCielWants(this.selectedItem);
      
      });

    }


    doTheCraftThingCielWants(item)
    {
        this.processedObject.halfQuality = Math.floor(item.RecipeLevelTable.Quality / 2); 

    }

}
