/////////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Philippe Leefsma 2014 - ADN/Developer Technical Services
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////////////////
var urn = '<replace with your document url - use http://models.autodesk.io to quickly upload models if needed>';

var viewer = null;

//////////////////////////////////////////////////////////////////////////
// Get token from our API URL.
// Current View & Data API requires a synchronous method
//
//////////////////////////////////////////////////////////////////////////
var getToken = function () {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/api/token', false);
    xhr.send(null);

    var response = JSON.parse(xhr.responseText);

    return response.access_token;
};

//////////////////////////////////////////////////////////////////////////
// on html document loaded
//
//////////////////////////////////////////////////////////////////////////
function onload() {

    //List of Supported Languages:
    // Chinese Simplified: zh-cn
    // Chinese Traditional: zh-tw
    // Czech: cs
    // English: en
    // French: fr
    // German: de
    // Italian: it
    // Japanese: ja
    // Korean: ko
    // Polish: pl
    // Portuguese Brazil: pt-br
    // Russian: ru
    // Spanish: es
    // Turkish: tr

    var options = {
      language:'en', //default - en
      env: 'AutodeskProduction',
      getAccessToken: getToken,
      refreshToken: getToken
    };

    urn = Autodesk.Viewing.Private.getParameterByName('urn') || urn;

    Autodesk.Viewing.Initializer(options, function () {

        initializeViewer('viewer', 'urn:' + urn, '3d');
    });
}

//////////////////////////////////////////////////////////////////////////
// Initialize viewer and load model
//
//////////////////////////////////////////////////////////////////////////
function initializeViewer(containerId, urn, role) {

    Autodesk.Viewing.Document.load(urn, function (model) {

        var rootItem = model.getRootItem();

        var geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(
          rootItem,
          { 'type': 'geometry', 'role': role },
          true);

        var domContainer = document.getElementById(containerId);

        //Control-less Version
        //viewer = new Autodesk.Viewing.Viewer3D(domContainer);

        //GUI Version
        viewer = new Autodesk.Viewing.Private.GuiViewer3D(domContainer);

        viewer.initialize();

        viewer.setLightPreset(8);

        viewer.addEventListener(
          Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
          onGeometryLoaded);
        
        viewer.load(model.getViewablePath(geometryItems[0]));
        
    }, function (msg) {

        console.log('Error loading document: ' + msg);
    });
}

//////////////////////////////////////////////////////////////////////////
// Model Geometry loaded callback
//
//////////////////////////////////////////////////////////////////////////
function onGeometryLoaded(event) {

    var viewer = event.target;

    viewer.removeEventListener(
      Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
      onGeometryLoaded);

    alert('Geometry Loaded!');
}

//////////////////////////////////////////////////////////////////////////
// Load custom extension
//
//////////////////////////////////////////////////////////////////////////
function loadExtension() {

  var options = {};

  viewer.loadExtension('Autodesk.ADN.Viewing.Extension.Basic', options);
}

//////////////////////////////////////////////////////////////////////////
// Load custom extension
//
//////////////////////////////////////////////////////////////////////////
function unloadExtension() {

  viewer.unloadExtension('Autodesk.ADN.Viewing.Extension.Basic');
}