# confluence-enhancer
Enhance the documenting capabilities of Confluence by allowing JS to run in the page that the author of the page adds. 

# How does it work?
A confluence page is identified as having potential to be far more intuative, interactive or better presented with the help of external scripts being run on the page.

The author links to this Repo where anyone can install the plugin for Chromium Browsers.

Once the plugin is installed, it will look for "scripts" in a collapsable with a specific label `scripts - please ignore`. This will allow users who haven't got the plugin to use the page as normal.
The plugin then identifies any scripts in a "collapsable" component in the page and runs the function "init".

The plugin can be toggled on or off by clicking on the plugin icon and toggling the switch

# Installation
In order to install this plugin you must:
* Have a chromium based browser (Like Google Chrome, Microsoft Edge, Opera, Brave, Vivaldi, Blisk, Epic Privacy Browser, Colibri, Slimjet, SRWare Iron)
* Have that browser in "developer mode" 

1. Go to `chrome://extensions/`
2. Enable Developer mode (top right)
3. Load Unpacked (top left)
4. Oh, you should have cloned/downloaded this first. If you haven't done that, do that.
5. Unzip this project if you downloaded it
6. Select the directory of this project

# Setup
Once you have a confluence page, go to "Edit", then "Insert more content", "other macros" then select the "collapsable" component.
Make the title `scripts - please ignore` and then the first line inside that component a link to this repo with the message "To view all content on this page please follow the instructions here".
Now you're free to add standard ECMAScript with a function "init" which will be called immediately. 

