import { Component, OnInit } from '@angular/core';
declare var $: any; // Declare jQuery
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit{

  constructor() { }

  ngOnInit(): void {
    // Initialize Owl Carousel with no navigation arrows
    $('#gov_bottom_slider2').owlCarousel({
      loop: true,           // Loop the slides
      margin: 20,           // Margin between items
      nav: false,           // Disable navigation arrows
      autoplay: true,       // Enable auto-play
      autoplayTimeout: 3000, // Time between slides in ms (3 seconds)
      autoplayHoverPause: true, // Pause on hover
      responsive: {
        0: { items: 1 },    // Number of items to show for small screens
        600: { items: 2 },  // Number of items to show for medium screens
        1000: { items: 3 },
        1200: { items: 4 } ,
        1500: { items: 5 },
        1700: { items: 6 }   // Number of items to show for large screens
      }
    });
  }
  hoverClick(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    if (button) {
      button.classList.add('clicked');

      // Remove the class after a short delay to allow the shadow to disappear
      setTimeout(() => {
        button.classList.remove('clicked');
      }, 200); // Adjust the delay (in milliseconds) based on your transition duration
    }
  }
}
