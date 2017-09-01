<!doctype html>
<!--
  Material Design Lite
  Copyright 2015 Google Inc. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License
-->
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="A front-end template that helps you build fast, modern mobile web apps.">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
    <title>Handsontable</title>

    <!-- <script type="text/javascript" src="js/vendor/jquery.min.js"></script> -->

    <!--
    Loading Handsontable (full distribution that includes all dependencies apart from jQuery)
    -->
    <script data-jsfiddle="common" src="dist/handsontable.full.js"></script>
    <link data-jsfiddle="common" rel="stylesheet" media="screen" href="dist/handsontable.full.css">



    <script src="js/load-image.all.min.js"></script>
    <!-- jQuery and Jcrop are not required by JavaScript Load Image, but included for the demo -->
    <script src="js/vendor/jquery.js"></script>
    <script src="js/vendor/jquery.Jcrop.js"></script>
    <script src="js/myLoad.js"></script>

    <script type="text/javascript" src="js/htemplate.js"></script>

    <!-- Add to homescreen for Chrome on Android -->
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="icon" sizes="192x192" href="images/android-desktop.png">

    <!-- Add to homescreen for Safari on iOS -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="Material Design Lite">
    <link rel="apple-touch-icon-precomposed" href="images/ios-desktop.png">

    <!-- Tile icon for Win8 (144x144 + tile color) -->
    <meta name="msapplication-TileImage" content="images/touch/ms-touch-icon-144x144-precomposed.png">
    <meta name="msapplication-TileColor" content="#3372DF">

    <link rel="shortcut icon" href="images/favicon.png">

    <!-- SEO: If your mobile URL is different from the desktop URL, add a canonical link to the desktop page https://developers.google.com/webmasters/smartphone-sites/feature-phones -->
    <!--
    <link rel="canonical" href="http://www.example.com/">
    -->

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.deep_purple-pink.min.css">

    <link rel="stylesheet" href="css/mystyle.css">
    <link rel="stylesheet" href="styles.css">
    <!-- Jcrop is not required by JavaScript Load Image, but included for the demo -->
    <link rel="stylesheet" href="css/vendor/jquery.Jcrop.css">

    <style>
        #view-source {
            position: fixed;
            display: block;
            right: 0;
            bottom: 0;
            margin-right: 40px;
            margin-bottom: 40px;
            z-index: 700;
        }
    </style>
</head>

<body class="mdl-demo mdl-color--grey-100 mdl-color-text--grey-700 mdl-base">
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header class="mdl-layout__header mdl-layout__header--scroll mdl-color--primary">
            <div class="mdl-layout--large-screen-only mdl-layout__header-row">
            </div>
            <div class="mdl-layout--large-screen-only mdl-layout__header-row">
                <span class="docs-layout-title mdl-layout-title">
         <img src="images/sheet.png">
         <a href="./">Ostrich Head in Sand</a>
       </span>
            </div>
            <div class="mdl-layout--large-screen-only mdl-layout__header-row">
            </div>
            <div class="mdl-layout__tab-bar mdl-js-ripple-effect mdl-color--primary-dark">
                <a href="#overview" class="mdl-layout__tab is-active">Prueba de carga</a>
                <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--4dp mdl-color--accent"
                    id="add">
            <i class="material-icons" role="presentation">add</i>
            <span class="visuallyhidden">Add</span>
          </button>
            </div>
        </header>
        <main class="mdl-layout__content">
            <div class="mdl-layout__tab-panel is-active" id="overview">
                <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                    <div class="mdl-card mdl-cell mdl-cell--12-col">
                        <div class="mdl-card__supporting-text">
                            <h4>Prueba de carga desde un json</h4>
                            <p><i>Est enim iudices haec non scripta sed nata lex quam non didicimus accepimus legimus uerum ex natura ipsa arripuimus hausimus expressimus ad quam non docti sed facti non instituti sed imbuti sumus
              </i></p>
              <?php include ('php/save.php'); ?>

                            <p>
                                <button name="load" id="load">Load</button>
                                <button name="save" id="save">Save</button>
                                <label><input type="checkbox" name="autosave" id="autosave" checked="checked" autocomplete="off"> Autosave</label>
                            </p>
                            <pre id="example1console" class="console">Click "Load" to load data from server</pre>
                            <div class="spreadsheet" id="example2"></div>
                            <script type="text/javascript" src="js/example.js"></script>
                </section>
                </div>
                <footer class="mdl-mega-footer">
                    <div class="mdl-mega-footer--middle-section">
                        <div class="mdl-mega-footer--drop-down-section">
                            <input class="mdl-mega-footer--heading-checkbox" type="checkbox" checked>
                            <h1 class="mdl-mega-footer--heading">Features</h1>
                            <ul class="mdl-mega-footer--link-list">
                                <li><a href="#">About</a></li>
                                <li><a href="#">Terms</a></li>
                                <li><a href="#">Partners</a></li>
                                <li><a href="#">Updates</a></li>
                            </ul>
                        </div>
                        <div class="mdl-mega-footer--drop-down-section">
                            <input class="mdl-mega-footer--heading-checkbox" type="checkbox" checked>
                            <h1 class="mdl-mega-footer--heading">Details</h1>
                            <ul class="mdl-mega-footer--link-list">
                                <li><a href="#">Spec</a></li>
                                <li><a href="#">Tools</a></li>
                                <li><a href="#">Resources</a></li>
                            </ul>
                        </div>
                        <div class="mdl-mega-footer--drop-down-section">
                            <input class="mdl-mega-footer--heading-checkbox" type="checkbox" checked>
                            <h1 class="mdl-mega-footer--heading">Technology</h1>
                            <ul class="mdl-mega-footer--link-list">
                                <li><a href="#">How it works</a></li>
                                <li><a href="#">Patterns</a></li>
                                <li><a href="#">Usage</a></li>
                                <li><a href="#">Products</a></li>
                                <li><a href="#">Contracts</a></li>
                            </ul>
                        </div>
                        <div class="mdl-mega-footer--drop-down-section">
                            <input class="mdl-mega-footer--heading-checkbox" type="checkbox" checked>
                            <h1 class="mdl-mega-footer--heading">FAQ</h1>
                            <ul class="mdl-mega-footer--link-list">
                                <li><a href="#">Questions</a></li>
                                <li><a href="#">Answers</a></li>
                                <li><a href="#">Contact us</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="mdl-mega-footer--bottom-section">
                        <div class="mdl-logo">
                            More Information
                        </div>
                        <ul class="mdl-mega-footer--link-list">
                            <li><a href="https://developers.google.com/web/starter-kit/">Web Starter Kit</a></li>
                            <li><a href="#">Help</a></li>
                            <li><a href="#">Privacy and Terms</a></li>
                        </ul>
                    </div>
                </footer>
        </main>
        </div>
        <a href="https://github.com/google/material-design-lite/blob/mdl-1.x/templates/text-only/" target="_blank" id="view-source"
            class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--accent mdl-color-text--accent-contrast">View Source</a>
        <script src="https://code.getmdl.io/1.3.0/material.min.js"></script>
</body>

</html>