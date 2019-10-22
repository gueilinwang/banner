(function($) {
  "use strict";

  let ModuleName = "banner";

  let Module = function(ele, options) {
    this.ele = ele;
    this.$ele = $(ele);
    this.option = options;
  };

  Module.DEFAULTS = {
    style: "banner",
    whenClickCallback: function() {
      console.log("whenClickCallback");
    },
    // 設定一開始是否為開或合
    openAtStart: true, // [boolean] true | false
    // 設定啟動後是否要自動開或合，若設為false，就不要自勳開合；若為true是馬上自動開合；若為數字是幾毫秒之後開合
    autoToggle: false // [boolean|number] true | false | 3000
  };

  Module.prototype.toggleBanner = function() {
    let opt = this.option;
    let name = $(".btn").text();
    $(".btn").toggleClass("down");
    if (!opt.transition) {
      //判斷是不是有transition效果,沒有transition效果
      if (name === opt.button.closeText) {
        //收合時
        $(".btn").text(opt.button.openText);
        $(".banner")
          .removeClass(`opened ${opt.class.opened}`)
          .addClass(`closed ${opt.class.closed}`);
      } else {
        //展開時
        $(".btn").text(opt.button.closeText);
        $(".banner")
          .removeClass(`closed ${opt.class.closed}`)
          .addClass(`opened ${opt.class.opened}`);
      }
    } else {
      if (name === opt.button.closeText) {
        //有transition效果
        $(".btn").text(opt.button.openText);
        $(".banner")
          .removeClass(`opened ${opt.class.opened}`)
          .addClass(`closing ${opt.class.closing}`);
      } else {
        $(".btn").text(opt.button.closeText);
        $(".banner")
          .removeClass(`closed ${opt.class.closed}`)
          .addClass(`opening ${opt.class.opening}`);
      }
      $(".wrap").on("transitionstart", function() {
        let interval = setInterval(opt.whenTransition, 100);
        $(this).on("transitionend", function() {
          if ($(".banner").hasClass("closing")) {
            $(".banner")
              .removeClass(`closing ${opt.class.closing}`)
              .addClass(`closed ${opt.class.closed}`);
          } else if ($(".banner").hasClass("opening")) {
            $(".banner")
              .removeClass(`opening ${opt.class.opening}`)
              .addClass(`opened ${opt.class.opened}`);
          }
          clearInterval(interval);
        });
      });
    }
  };

  Module.prototype.init = function() {
    let self = this;
    let opt = this.option;
    let banner = document.querySelector(".banner");
    //判斷一開始banner是打開還是關閉
    if (opt.openAtStart) {
      $(".banner")
        .addClass("opened transition")
        .addClass(opt.class.opened);

      let bannerBtn = `<div class="btn">${opt.button.closeText}</div>`;
      $(".wrap").after(bannerBtn);
      $(".btn").addClass(opt.button.class);
      if (opt.autoToggle) {
        //判斷是否需要自動開合
        let time = typeof opt.autoToggle === "boolean" ? 0 : opt.autoToggle;
        setTimeout(self.toggleBanner.bind(this), time);
      }
    } else {
      $(".banner")
        .addClass("closed transition")
        .addClass(opt.class.closed);

      let bannerBtn = `<div class="btn">${opt.button.openText}</div>`;
      $(".wrap").after(bannerBtn);
      $(".btn").addClass(`down ${opt.button.class}`);

      if (opt.autoToggle) {
        let time = typeof opt.autoToggle === "boolean" ? 0 : opt.autoToggle;
        setTimeout(self.toggleBanner.bind(this), time);
      }
    }
    if (!opt.transition) {
      //判斷是否有transition效果
      $(".banner").removeClass("transition");
    }

    $(".btn").click(function() {
      self.toggleBanner();
    });
  };

  Module.prototype.toggle = function() {
    this.toggleBanner();
  };
  Module.prototype.open = function() {
    let self = this;
    if ($(".btn").text() === self.option.button.openText) {
      self.toggleBanner();
    } else return;
  };
  Module.prototype.close = function() {
    let self = this;
    if ($(".btn").text() === self.option.button.closeText) {
      self.toggleBanner();
    } else return;
  };

  $.fn[ModuleName] = function(methods, options) {
    return this.each(function() {
      let $this = $(this);
      let module = $this.data(ModuleName);
      let opts = null;
      if (!!module) {
        if (typeof options === "string" && typeof options2 === "undefined") {
          module[options]();
        } else if (
          typeof options === "string" &&
          typeof options2 === "object"
        ) {
          module[options](options2);
        } else {
          console.log("unsupported options!");
          throw "unsupported options!";
        }
      } else {
        opts = $.extend(
          {},
          Module.DEFAULTS,
          typeof methods === "object" && methods,
          typeof options === "object" && options
        );

        module = new Module(this, opts);

        $this.data(ModuleName, module);

        module.init();
      }
    });
  };
})(jQuery);
