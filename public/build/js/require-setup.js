"use strict";

requirejs.config({
  "baseUrl": "/",
  "shim": {
    "semantic": { "deps": ['jquery'] }
  },
  "paths": {
    "form": "js/main",
    "company": "js/company",
    "semantic": "semantic/dist/semantic.min",
    "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min",
    "vue": "https://cdnjs.cloudflare.com/ajax/libs/vue/2.1.4/vue.min",
    "slick": "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min",
    "chart": "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min",
    "ftscroller": "vendor/ftscroller"
  }
});

switch (window.location.pathname) {
  case '/':
    require(['form']);
    console.log(window.location.pathname);
    break;
  case '/company':
    require(['company']);
    console.log(window.location.pathname);
    break;
}