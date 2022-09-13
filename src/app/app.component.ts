import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { async } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'O2R';
  loadedPlayers: any;
  currentPage: any;
  loading: any;
  popupVisible: any;
  playerDetails: any;
  playerMovies: any = [];

  constructor(private http: HttpClient) {  }

  ngOnInit() {
    this.showPagePlayers(1);
    this.popupVisible = false;
  }

  showPagePlayers(pageNum: number) {
    this.loading = true;

    if (pageNum == 0) {
      pageNum = 1;
    }
    else if (pageNum == 7) {
      pageNum = 6;
    }

    this.currentPage = pageNum;
    let data = sessionStorage.getItem(pageNum.toString());
    if (data !== null) {
      let res = JSON.parse(data);
      console.log("Page #" + pageNum + " was loaded from session storage: ", res);

      this.loadedPlayers = res;
      this.loading = false;
    }


    else {
      let url = "https://swapi.dev/api/people/?page=" + pageNum;
      this.http.get(url).subscribe((res: any) => {
        console.log("Page #" + pageNum + " was recieved from API: ", res.results);

        sessionStorage.setItem(pageNum.toString(), JSON.stringify(res.results));
        this.loadedPlayers = res.results;
        this.loading = false;
      }, err => {
        console.log("Error: ", err);
        this.loading = false;
      });
    }


  }

  showDetails(playerData: any) {
    this.loading = true;
    this.playerMovies = [];
    console.log(">> player data: ", playerData);

    let key = playerData.name + "Mov";
    let data = sessionStorage.getItem(key);
    if (data !== null) {
      let res = JSON.parse(data);
      console.log("Player Movies was loaded from session storage");
      this.playerMovies = res;
      this.loading = false;
    }
    else {
      for (let movie of playerData.films) {
        this.http.get(movie).subscribe((res: any) => {
          this.playerMovies.push(res.title.toString());
          sessionStorage.setItem(key, JSON.stringify(this.playerMovies));
        }, err => {
          console.log("Error: ", err);
        })
      }
      this.loading = false;
      console.log("Player Movies was recieved from API");
    }
    
    this.playerDetails = playerData;
    this.popupVisible = true;
  }
  closeDetails() {
    this.popupVisible = false;
  }
}
