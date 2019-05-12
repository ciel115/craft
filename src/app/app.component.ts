import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  
    recipe:any = {};
    halfQuality:number = 0;
    ingArray:Array<object> = [];

    constructor(private http:HttpClient){}

    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
     
      this.fetchItem(977);


    }


    
    fetchItem(itemID){ //fetches the XivItem Properties for the given ID

      this.http.get('https://xivapi.com/recipe/' + itemID).subscribe((response)=>{ 
          this.recipe = response;
          this.getHalfQuality(this.recipe);
          this.collectIngredients(this.recipe);
          
      });

    }

    getHalfQuality(item) //gets max potential starting quality for recipe
    {
      this.halfQuality = Math.floor(item.RecipeLevelTable.Quality / 2); 
    }


    collectIngredients(item) //puts relevant ingredient properties into array of objects
    {
        var num = 0
        var amount = item["AmountIngredient"+num.toString()]

        while(amount>0 && num<8) {
            
          var ingredient = {
            name: <string> item["ItemIngredient"+num.toString()].Name,
            quantity: <number> amount,
            icon: <string> "https://xivapi.com" + item["ItemIngredient"+num.toString()].Icon,
            level: <number> item["ItemIngredient"+num.toString()].LevelItem
          }

          console.log(ingredient)

          this.ingArray.push(ingredient)

          num += 1
          amount = item["AmountIngredient"+num.toString()]

        }

        

        
    }

}
