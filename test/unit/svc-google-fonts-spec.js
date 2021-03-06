/* jshint expr:true */
"use strict";

describe("Google Font Loader", function() {
  var $httpBackend, mockAngularLoad, googleFontLoader;

  beforeEach(module("risevision.widget.common"));

  beforeEach(module(function($provide) {
    $provide.factory("angularLoad", function() {
      return {
        loadCSS: function() {
          return;
        }
      };
    });
  }));

  beforeEach(inject(function(angularLoad) {
    mockAngularLoad = angularLoad;
  }));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get("$httpBackend");

    $httpBackend.when("GET", "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBXxVK_IOV7LNQMuVVo_l7ZvN53ejN86zY&sort=alpha")
      .respond({
        items: [
        {
          family: "ABeeZee",
          subsets: ["latin"]
        },
        {
          family: "Buda",
          subsets: ["latin", "latin-ext"]
        },
        {
          family: "Slabo 27px",
          subsets: ["khmer"]
        }]
      });
  }));

  beforeEach(inject(function(_googleFontLoader_) {
    googleFontLoader = _googleFontLoader_;
  }));

  describe("googleFontLoader", function() {
    it("should exist", function() {
      expect(googleFontLoader).to.be.defined;
    });
  });

  describe("getGoogleFonts", function() {
    it("should exist", function() {
      expect(googleFontLoader.getGoogleFonts).be.defined;
      expect(googleFontLoader.getGoogleFonts).to.be.a("function");
    });

    it("should not return fonts that have a subset of 'khmer'", function () {
      googleFontLoader.getGoogleFonts();
      $httpBackend.flush();

      expect(googleFontLoader.getGoogleFonts().urls).to.have.lengthOf(1);
    });

    it("should return an object containing font families and URLs", function () {
      var fonts =
        {
          fonts: "ABeeZee=ABeeZee,sans-serif;",
          urls: [
            "//fonts.googleapis.com/css?family=ABeeZee"
          ]
        };

      googleFontLoader.getGoogleFonts();
      $httpBackend.flush();

      expect(googleFontLoader.getGoogleFonts()).to.deep.equal(fonts);
    });
  });

  describe("getFontsUsed", function () {
    it("should exist", function() {
      expect(googleFontLoader.getFontsUsed).be.defined;
      expect(googleFontLoader.getFontsUsed).to.be.a("function");
    });

    it("should filter a list of provided fonts and only return those that are Google fonts", function () {
      googleFontLoader.getGoogleFonts();
      $httpBackend.flush();

      expect(googleFontLoader.getFontsUsed("verdana,ABeeZee,")).to.deep.equal(["ABeeZee"]);
    });
  });

});
