'use strict';

require(['jquery', 'vue', 'slick', 'ftscroller', 'chart', 'semantic'], function ($, Vue, slick, ftscroller, Chart) {
  console.log('company init');

  Vue.component('total-companies', {
    template: '<div class="statistic">\n                  <div class="value">\n                    {{ total }}\n                  </div>\n                </div>',
    props: ['total']
  });

  Vue.component('company-list', {
    template: '#companies-list',
    props: ['company'],
    data: {
      isActive: true
    },
    methods: {
      selectItem: function selectItem(e) {
        var item = $(e.target).parents('.item');

        if (!item.hasClass('is-active')) {
          $('.item').removeClass('is-active');
          item.addClass('is-active');
        } else {
          return false;
        }
      }
    }
  });

  Vue.component('diagram', {
    template: '<div>\n                <div>{{ location }}</div>\n                <div></div>\n              </div>',
    props: ['location']
  });

  Vue.component('news-list', {
    template: '#news-list',
    props: ['news', 'newsDate']
  });

  var company = new Vue({
    el: '#company',
    data: {
      companyUrl: 'http://codeit.pro/frontTestTask/company/getList',
      newsUrl: 'http://codeit.pro/frontTestTask/news/getList',
      newsList: false,
      companyList: false,
      totalCompanies: 0,
      isActive: true,
      countriesAmount: false,
      newsDate: []
    },
    created: function created() {
      this.getCompanies();
      this.getNews();
    },
    mounted: function mounted() {},
    computed: {},
    methods: {
      getCompanies: function getCompanies() {
        var self = this;

        $('.ui.loader').css({ display: 'block' });

        $.get(this.companyUrl).done(function (data) {

          self.companyList = data.list;

          self.totalCompanies = self.companyList.length;

          $('.ui.loader').css({ display: 'none' });

          setTimeout(function () {
            var containerElement, scroller;

            containerElement = document.getElementById('companies');

            scroller = new ftscroller.FTScroller(containerElement, {
              scrollingX: false
            });

            $('.ftscroller_y').addClass('ui').addClass('celled').addClass('list');
          }, 50);

          // console.log(self.companyList);

          self.getCountCountries();
        }).fail(function (error) {
          console.log(error);
        });
      },
      getNews: function getNews() {
        var self = this;

        $('.ui.loader').css({ display: 'block' });

        $.get(this.newsUrl).done(function (data) {
          self.newsList = data.list;

          setTimeout(function () {
            $('#news-slider').slick({
              arrows: false,
              dots: true
            });

            $('.item .description p').each(function () {
              var newText = '';
              var DESC_MAX_LENGTH = 75;

              if ($(this).text().length > DESC_MAX_LENGTH) {
                newText = $(this).text().substring(0, DESC_MAX_LENGTH);
                newText += '...';
                $(this).text(newText);
              }
            });

            self.newsList.map(function (news) {
              var date = this.formatDate(news.date);
            }, self);

            $('.date').each(function (i) {
              $(this).text(self.newsDate[i]);
            });
          }, 50);

          $('.ui.loader').css({ display: 'none' });
          // console.log(data, company.newsList);
        }).fail(function (error) {
          console.log(error);
        });
      },
      getCountCountries: function getCountCountries() {
        this.countriesAmount = {
          ua: 0,
          pl: 0,
          se: 0,
          de: 0,
          us: 0,
          no: 0,
          total: 0
        };

        this.companyList.map(function (company) {
          this.countriesAmount.total++;

          switch (company.location.code) {
            case 'UA':
              this.countriesAmount.ua++;
              break;
            case 'PL':
              this.countriesAmount.pl++;
              break;
            case 'SE':
              this.countriesAmount.se++;
              break;
            case 'DE':
              this.countriesAmount.de++;
              break;
            case 'US':
              this.countriesAmount.us++;
              break;
            case 'NO':
              this.countriesAmount.no++;
              break;
          }
        }, this);

        // console.log('UA: ' + this.countriesAmount.ua + '\n' + 'PL: ' + this.countriesAmount.pl + '\n' + 'SE: ' + this.countriesAmount.se + '\n' + 'DE: ' + this.countriesAmount.de + '\n' + 'US: ' + this.countriesAmount.us + '\n' + 'NO: ' + this.countriesAmount.no);
        // console.log('Total: ' + this.countriesAmount.total);

        this.initChart(this.countriesAmount);

        // return this.;
      },
      initChart: function initChart(countriesAmount) {
        // init chart
        // Doughnut Chart Options
        var doughnutOptions = {

          segmentShowStroke: true,

          segmentStrokeColor: "#fff",

          segmentStrokeWidth: 2,

          percentageInnerCutout: 50,

          animation: true,

          animationSteps: 100,

          animationEasing: "easeOutBounce",

          animateRotate: true,

          animateScale: true,

          onAnimationComplete: null
        };

        var ua = countriesAmount.ua,
            pl = countriesAmount.pl,
            se = countriesAmount.se,
            de = countriesAmount.de,
            us = countriesAmount.us,
            no = countriesAmount.no;

        // Doughnut Chart Data
        var doughnutData = [{
          value: ua,
          color: "purple",
          highlight: "#5AD3D1",
          label: "Ukraine"
        }, {
          value: pl,
          color: "#1789D4",
          highlight: "#5AD3D1",
          label: "Poland"
        }, {
          value: se,
          color: "#CB4B16",
          highlight: "#5AD3D1",
          label: "Sweden"
        }, {
          value: de,
          color: "#1F8261",
          highlight: "#5AD3D1",
          label: "Germany"
        }, {
          value: us,
          color: "#FFA500",
          highlight: "#5AD3D1",
          label: "United States"
        }, {
          value: no,
          color: "lime",
          highlight: "#5AD3D1",
          label: "Norway"
        }];

        var ctx = document.getElementById("doughnutChart").getContext("2d");
        var mydoughnutChart = new Chart(ctx).Doughnut(doughnutData, doughnutOptions);

        // console.log(countriesAmount.ua);
      },
      formatDate: function formatDate(ts) {
        var date = void 0,
            days = void 0,
            months = void 0,
            years = void 0;

        date = new Date(Number(ts));
        days = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        months = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        years = date.getFullYear();

        this.newsDate.push(days + '.' + months + '.' + years);
      }
    }
  });

  $('#news-slider').on('init', function (slick) {
    console.log('slick init', slick);

    $('.slick-track').addClass('ui').addClass('items');
  });
});