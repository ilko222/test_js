Feature: First navigation to OLX
  Scenario: 1. Geolocation verification
    Given User navigates to "OLX_Home_Page"
    And   User enters "1234567890" in search field "mainPage|mainPageSearchField"
    When  User clicks search button "#submit-searchmain"
    Then  Page URL is equal to "https://www.olx.ua/list/q-1234567890/"
    Then  Attribute "value" of Search field "input#search-text" is equal to "1234567890"
    And   Geo Suggestions "#geo-suggestions" is displayed
    When  User clicks on search geolocation fielad "#cityField"
    Then  Regions layer "#regions-layer" is displayed
    And   User clicks Вся Украина "a.regionSelectA1" with text "Вся Украина"
    Then  Regions layer "#regions-layer" is not displayed
    Then  Attribute "defaultval" of Search field "input#cityField" is equal to "Вся Украина - ERROR TRIGGER"

  Scenario: 2. Go to OLX and search for "iphone"
    Given User navigates to "https://www.olx.ua/"
    And   User enters "iphone" in search field "mainPage|mainPageSearchField"
    When  User clicks search button "#submit-searchmain"
    Then  Page URL is equal to "https://www.olx.ua/list/q-iphone/"
    Then  Attribute "value" of Search field "input#search-text" is equal to "iphone"
    And   Promoted items table "table.fixed.offers.breakword.offers--top.redesigned" is displayed
    And   Regular items table "table#offers_table.fixed.offers.breakword.redesigned" is displayed
