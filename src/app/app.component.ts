import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    //recipes$: Observable<Recipe[]>;

    constructor(private http:HttpClient) {
    }

    ngOnInit() {
        console.log("test this");
        this.http.get('https://xivapi.com/recipe/95?pretty=1').subscribe((response)=>{

        console.log(response);
        })
    }
}