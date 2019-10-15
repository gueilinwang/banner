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
    autoToggle: true // [boolean|number] true | false | 3000
  };

  Module.prototype.init = function() {
    let opt = this.option;
    let banner = document.querySelector(".banner");

    function changeName(name) {
      if (!opt.transition) {
        //判斷是不是有transition效果,沒有transition效果
        if (name === opt.button.closeText) {
          $(".btn").text(opt.button.openText);
          $(".banner")
            .toggleClass(opt.class.opened)
            .toggleClass(opt.class.closed);
        } else {
          $(".btn").text(opt.button.closeText);
          $(".banner")
            .toggleClass(opt.class.closed)
            .toggleClass(opt.class.opened);
        }
      } else {
        if (name === opt.button.closeText) {
          //有transition效果
          $(".btn").text(opt.button.openText);
          $(".banner")
            .toggleClass(opt.class.opened)
            .toggleClass(opt.class.closing);
        } else {
          $(".btn").text(opt.button.closeText);
          $(".banner")
            .toggleClass(opt.class.closed)
            .toggleClass(opt.class.opening);
        }
        $(".banner").on("transitionstart", function() {
          let interval = setInterval(opt.whenTransition, 200);
          $(this).on("transitionend", function() {
            if (banner.className.includes("closing")) {
              $(".banner")
                .toggleClass("closing")
                .toggleClass("closed");
            } else if (banner.className.includes("opening")) {
              $(".banner")
                .toggleClass("opening")
                .toggleClass("opened");
            }
            clearInterval(interval);
          });
        });
      }
    }
    function closeBanner() {
      $(".btn").toggleClass("down");
      changeName($(".btn").text());
    }
    function openBanner() {
      $(".btn").toggleClass("down");
      changeName($(".btn").text());
    }
    //判斷一開始banner是打開還是關閉
    if (opt.openAtStart) {
      $(".banner").addClass("opened transition");
      let bannerBtn = `<div class="${opt.button.class}">${opt.button.closeText}</div>`;
      $(".wrap").after(bannerBtn);
      if (opt.autoToggle) {
        //判斷是否需要自動開合
        let time = typeof opt.autoToggle === "boolean" ? 0 : opt.autoToggle;
        setTimeout(closeBanner, time);
      }
    } else {
      $(".banner").addClass("closed transition");
      let bannerBtn = `<div class="${opt.button.class}">${opt.button.openText}</div>`;
      $(".wrap").after(bannerBtn);
      $(".btn").addClass("down");
      if (opt.autoToggle) {
        let time = typeof opt.autoToggle === "boolean" ? 0 : opt.autoToggle;
        setTimeout(openBanner, time);
      }
    }
    if (!opt.transition) {
      //判斷是否有transition效果
      $(".banner").removeClass("transition");
    }

    $(".btn").click(function() {
      if (banner.className.includes(opt.class.opened)) {
        closeBanner();
      } else if (banner.className.includes(opt.class.closed)) {
        openBanner();
      }
    });
  };
  Module.prototype.toggle = function() {};
  Module.prototype.open = function() {};
  Module.prototype.close = function() {};

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
