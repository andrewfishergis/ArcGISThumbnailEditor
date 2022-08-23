# ArcGIS Thumbnail Editor

_Lightweight, customizable web application for the creation of ArcGIS Portal and Online Thumbnails_

The code behind this application is free for you to use and customize. Below are some instructions for how you can utilize the full functionality of this application.

Introduction

## Specifications

- This application utilizes HTML5 canvas elements. Make sure your browser supports HTML5.
- Third party js dependencies. For simplicity, these are loaded via CDN:
  - [canvg.js](https://github.com/canvg/canvg)
  - [vibrant.js](https://jariz.github.io/vibrant.js/)
  - [jquery](https://jquery.com)

## Installation

Just copy all files and directories, and copy to your server as is

# Customization

## Creating new templates

The application opens with a splash window, asking for the user to select a template. These templates are simply .svg files created in graphic editing software ([Inkscape](inkscape.com), [Adobe Illustrator](adobe.com), etc.) The following gives an overview of how an SVG needs to be set up in order to work out of the box with this application:

### 1. Document size must be 600 x 400 px

This is the # minimum resolution put forward in the guidelines by [ESRI](https://doc.arcgis.com/en/arcgis-online/manage-data/item-details.htm).

### 2. SVG Elements must contain the proper id attributes

The SVG xml specification allows for an id attribute associated with each graphic element. Different vector editing software allow you to specify id attribution of elements in different ways:

- Inkscape - Right click on object -> Object Properties -> ID
- Adobe Illustrator - Name of object/path will be ID of node in SVG
- Text Editor - Simply rename ID of node, e.g. id="LayerID"

The following is a list of the different SVG Nodes that are utilized in the SVG template for this application

-Background (#BACKGROUND)
-Name Plate (#NAMEPLATE)
-Type Plate (#TYPEPLATE)
-Organization Text (#ORGANIZATION)
-Year Text (#YEAR)
-Name Plate Text (#nametext)
-Type Plate Text (#typeplate)
-Seal/Logo (#SEAL)
-Object Type Icon (#ICON)

### Custom Vector Objects

There is a section in the application that will allow you to add and manipulate custom vector shapes. To do this, add any custom objects to your svg, and give them an ID with the format of #V_<object_name>. For instance, if I wanted to add an object in the shape of a rectangle to my SVG template, I would give it an ID of #V_Square. This will then show up as an editible object in the 'Custom Vectors' section of the application.
