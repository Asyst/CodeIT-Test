require(['jquery', 'vue', 'slick', 'ftscroller', 'chart', 'semantic'], function ($, Vue, slick, ftscroller, Chart) {

  Vue.component('total-companies', {
    template: `<div class="statistic">
                  <div class="value">
                    {{ total }}
                  </div>
                </div>`,
    props: ['total']
  });

  Vue.component('company-list', {
    template: '#companies-list',
    props: ['company'],
    data: {
      isActive: true
    },
    methods: {
      selectItem: function (e) {
        let item = $(e.target).parents('.item');

        if (!item.hasClass('is-active')) {
          $('.item').removeClass('is-active');
          item.addClass('is-active')
        } else {
          return false;
        }
      }
    }
  });

  Vue.component('diagram', {
    template: `<div>
                <div>{{ location }}</div>
                <div></div>
              </div>`,
    props: ['location']
  });

  Vue.component('news-list', {
    template: '#news-list',
    props: ['news', 'newsDate']
  });

  let company = new Vue({
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
    created: function () {
      this.getCompanies();
      this.getNews();
    },
    mounted: function () {

    },
    computed: {

    },
    methods: {
      getCompanies: function () {
        let self = this;

        $('.ui.loader').css({display: 'block'});

        $.get(this.companyUrl)
          .done(function (data) {

            self.companyList = data.list;

            self.totalCompanies = self.companyList.length;

            $('.ui.loader').css({display: 'none'});

            setTimeout(function () {
              var containerElement, scroller;

              containerElement = document.getElementById('companies');

              scroller = new ftscroller.FTScroller(containerElement, {
                  scrollingX: false
              });

              $('.ftscroller_y').addClass('ui').addClass('celled').addClass('list')
            }, 50);

            self.getCountCountries();
          })
          .fail(function (error) {
            console.log(error);
          });
      },
      getNews:function () {
        let self = this;

        $('.ui.loader').css({display: 'block'});

        $.get(this.newsUrl)
          .done(function (data) {
            self.newsList = data.list;

            setTimeout(function () {
              $('#news-slider').slick({
                arrows: false,
                dots: true
              });

              $('.item .description p').each(function () {
                let newText = '';
                const DESC_MAX_LENGTH = 75;

                if ($(this).text().length > DESC_MAX_LENGTH) {
                  newText = $(this).text().substring(0, DESC_MAX_LENGTH);
                  newText += '...';
                  $(this).text(newText)
                }

              });

              self.newsList.map(function (news) {
                let date = this.formatDate(news.date);

              }, self);

              $('.date').each(function (i) {
                $(this).text(self.newsDate[i]);
              });

            }, 50);

            $('.ui.loader').css({display: 'none'});
            // console.log(data, company.newsList);
          })
          .fail(function (error) {
            console.log(error);
          });
      },
      getCountCountries: function () {
        this.countriesAmount = {
          total: 0
        };

        this.companyList.map(function (company) {
          this.countriesAmount.total++;

          if ( this.countriesAmount[company.location.code] !== undefined ) {
            this.countriesAmount[company.location.code] += 1;
          }
          else {
            this.countriesAmount[company.location.code] = 1;
          }

        }, this);

        this.initChart(this.countriesAmount);
      },
      initChart: function (countriesAmount) {
        // init chart
        // Doughnut Chart Options
        let
          country = {};
          doughnutOptions = {

        	segmentShowStroke : true,

        	segmentStrokeColor : "#fff",

        	segmentStrokeWidth : 2,

        	percentageInnerCutout : 50,

        	animation : true,

        	animationSteps : 100,

        	animationEasing : "easeOutBounce",

        	animateRotate : true,

        	animateScale : true,

        	onAnimationComplete : null
        }

        for ( let code in countriesAmount ) {
          country[code] = countriesAmount[code];
        }

        // Doughnut Chart Data
        let doughnutData = [
        	{
        		value: country.UA,
        		color:"purple",
            highlight: "#5AD3D1",
            label: "Ukraine"
        	},
        	{
        		value : country.PL,
        		color : "#1789D4",
            highlight: "#5AD3D1",
            label: "Poland"
        	},
        	{
        		value : country.SE,
        		color : "#CB4B16",
            highlight: "#5AD3D1",
            label: "Sweden"
        	},
        	{
        		value : country.DE,
        		color : "#1F8261",
            highlight: "#5AD3D1",
            label: "Germany"
        	},
        	{
        		value : country.US,
        		color : "#FFA500",
            highlight: "#5AD3D1",
            label: "United States"
        	},
          {
        		value : country.NO,
        		color : "lime",
            highlight: "#5AD3D1",
            label: "Norway"
        	}
        ]

        let ctx = document.getElementById("doughnutChart").getContext("2d");
        let mydoughnutChart = new Chart(ctx).Doughnut(doughnutData, doughnutOptions);

      },
      formatDate: function (ts) {
        let date, days, months, years;

        date = new Date(Number(ts) * 1000);
        days = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        months = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        years = date.getFullYear();

        this.newsDate.push(days + '.' + months + '.' + years);

      }
    }
  });

  $('#news-slider').on('init', function (slick) {
    $('.slick-track').addClass('ui').addClass('items');
  })
});
