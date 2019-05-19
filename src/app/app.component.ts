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
    ingArray:any = []; //ingredients with relevant info
    neededQuality:number = 3887;
    hqArray:any = []; //indexes of ingArray

    constructor(private http:HttpClient){}

    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
     
      this.fetchItem(33157);

 
    }


    
    fetchItem(itemID){ //fetches the XivItem Properties for the given ID

      this.http.get('https://xivapi.com/recipe/' + itemID).subscribe((response)=>{ 
          this.recipe = response;
          this.getHalfQuality(this.recipe);
          this.collectIngredients(this.recipe);
          this.hqArray = this.whatToHQ(this.neededQuality, this.ingArray);

          console.log(this.hqArray)
          
      });

    }

    getHalfQuality(item) //gets max potential starting quality for recipe
    {
      this.halfQuality = Math.floor(item.QualityFactor / 100 * item.RecipeLevelTable.Quality / 2); 
    }


    collectIngredients(item) //puts relevant ingredient properties into array of objects, finds quality given by each ingredient, sorts array by ingredient level
    {
        var num = 0
        var amount = item["AmountIngredient"+num.toString()]
        var totalLevel = 0

        while(amount>0 && num<8) {
            
          var ingredient = {
            name: <string> item["ItemIngredient"+num.toString()].Name,
            quantity: <number> amount,
            icon: <string> "https://xivapi.com" + item["ItemIngredient"+num.toString()].Icon,
            level: <number> item["ItemIngredient"+num.toString()].LevelItem,
            canHQ: <number> item["ItemIngredient"+num.toString()].CanBeHq,
            qualityPer: <number> 0
          }

          if (ingredient.name == "Gyr Abanian Alchemic"){ //defense agaisnt relevant special case (game says this item can be HQ but it currently never is)
            ingredient.canHQ = 0;
          }

          totalLevel += ingredient.quantity * ingredient.level;

          this.ingArray.push(ingredient)

          num += 1
          amount = item["AmountIngredient"+num.toString()]

        }
        
        for(var i = 0; i < this.ingArray.length; i++){ //calculates starting quality given by each ingredient

          this.ingArray[i].qualityPer = Math.floor(this.halfQuality*(this.ingArray[i].level/totalLevel)); 

          console.log(this.ingArray[i])
        }

        this.ingArray.sort(function(obj1, obj2) { //sort the ingredients by level

          return obj1.level - obj2.level;

        });

        console.log("Sorted by level:")
        for(var i = 0; i < this.ingArray.length; i++){
          console.log(this.ingArray[i])
        }
        
        
    }

    whatToHQ(neededQ, ingredients){ // show which ingredints (starting with lowest level) needed HQ to reach desired starting quality

      console.log(neededQ)
      console.info(ingredients)

      var quality = 0
      var i = 0
      var arrayHQ = []

      while (quality < neededQ && i < ingredients.length){ //add ingredients until desired quality reached

        if (ingredients[i].canHQ == 1) {

          for(var j = 0; j < ingredients[i].quantity && quality < neededQ; j++){ 

            quality += ingredients[i].qualityPer
            console.log("added one "+ingredients[i].name+" at "+ingredients[i].qualityPer+" quality. Total = "+quality+"/"+neededQ)
    
            arrayHQ.push(i)

          }

        } else {
          console.log(ingredients[i].name+" cannot be HQ or contribute quality. Total = "+quality+"/"+neededQ)
        }

        i++

      }

      console.info(arrayHQ)

      if (ingredients[0].qualityPer <= (quality - neededQ)){ //remove ingredients giving excess quality if necessary

        for(var k = arrayHQ.length-1; k >=0; k--){ 
        
          if ((quality - neededQ) >= ingredients[arrayHQ[k]].qualityPer){

            quality -= ingredients[arrayHQ[k]].qualityPer
            console.log("removing one "+ingredients[arrayHQ[k]].name+" at "+ingredients[arrayHQ[k]].qualityPer+" quality. Total = "+quality+"/"+neededQ)
            
            arrayHQ.splice(k, 1)
          }
        }
      }

      return arrayHQ

    }

}
