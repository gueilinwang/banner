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
    let btn = document.querySelector(".btn");
    function changeName(name) {
      if (name === opt.button.closeText) {
        $(".btn").text(opt.button.openText);
      } else {
        $(".btn").text(opt.button.closeText);
      }
    }
    function closeBanner() {
      $(".banner").toggleClass(opt.class.opened);
      $(".banner").toggleClass(opt.class.closing);
      let a = setInterval(opt.whenTransition, 300);
      changeName($(".btn").text());
      $(".banner").toggleClass(opt.class.closing);
      $(".banner").toggleClass(opt.class.closed);
      setTimeout(() => {
        clearInterval(a);
      }, 2000);
    }
    function openBanner() {
      $(".banner").toggleClass(opt.class.closed);
      $(".banner").toggleClass(opt.class.opening);
      changeName($(".btn").text());
      $(".banner").toggleClass(opt.class.opening);
      $(".banner").toggleClass(opt.class.opened);
    }

    if (opt.openAtStart) {
      $(".banner").addClass("opened");
      let bannerBtn = `<div class="${opt.button.class}">${opt.button.closeText}</div>`;
      $(".wrap").after(bannerBtn);
      if (opt.autoToggle) {
        let time = typeof opt.autoToggle === "boolean" ? 0 : opt.autoToggle;
        setTimeout(closeBanner, time);
      }
    } else {
      $(".banner").addClass("closed");
      let bannerBtn = `<div class="${opt.button.class}">${opt.button.openText}</div>`;
      $(".wrap").after(bannerBtn);
      if (opt.autoToggle) {
        let time = typeof opt.autoToggle === "boolean" ? 0 : opt.autoToggle;
        setTimeout(openBanner, time);
      }
    }
    $(".btn").click(function() {
      let btn = document.querySelector(".btn");
      if (banner.className.includes(opt.class.opened)) {
        closeBanner();
      } else if (banner.className.includes(opt.class.closed)) {
        openBanner();
      }
    });
  };

  $.fn[ModuleName] = function(methods, options) {
    console.log("this:", this);
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
