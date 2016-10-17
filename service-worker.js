'use strict'

// ADD CACHE POLYFILL TO SUPPORT CACHE API IN ALL BROWSERS
importScripts('./cache-polyfill.js');

// CACHE NAME:
var cache_name = 'cache_bmtc_v1';

// TODO: ADD RELEVANT FILES TO THE FOLLOWING ARRAY, TO BE LOADED IN CACHE:
var filesToCache = [
	'/',
	'./index.html',
	'./bus_routes.html',
	'./user_journey.html',
	'./css/',
	'./css/material_icons_stylesheet.css',
	'./css/material.css',
	'./css/material.min.css',
	'./css/material.min.css.map',
	'./css/style.css',
	'./css/stylesheet.css',
	'./js/',
	'./js/app.js',
	'./js/jquery.js',
	'./js/material.js',
	'./js/material.min.js',
	'./js/material.min.js.map'
];

// INSTALL:
self.addEventListener('install', function(event){

	event.waitUntil(

		// LOAD CACHE WITH MINIMAL HTML, CSS, JS (APP SHELL)
		caches.open(cache_name).then(function(cache){

			// ADD FILES TO CACHE
			return cache.addAll(filesToCache).then(function(){

				console.info('[INSTALL] Service worker loaded App Shell successfully');

				// FORCE SERVICE WORKER TO GO FROM WAITING STATE TO ACTIVE STATE
				return self.skipWaiting();

			}).catch(function(err){
				console.log('[INSTALL] Failed to Load the App Shell: ', err);
			});
		})
	);
});


// ACTIVATE:
self.addEventListener('activate', function(event){

	console.info('[ACTIVATE] Service Worker Activated');

	// INDICATE BROWSER TO MAKE SERVICE WORKER IN ACTIVE STAGE
	// WHEN NEW CODE/FEATURE IS PUSHED, SO THAT USER CAN GET IT
	// FROM SERVER AND CACHES IT WITHOUT REFRESHING THE PAGE
	return self.clients.claim();
});


// FETCH:
self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(response) {
      //If response is already in cache, return it
      if (response) {
        console.info("[Fetch] Found response in cache.");
        return response;
      }

      //else response is not cached, add it to cache and return response
      return fetch(event.request).then(function(response) {
        var responseToCache = response.clone();
        //Open the caches and put request & response into the cache
        caches.open(cache_name).then(function(cache) {
          cache.put(event.request, responseToCache)
          .then(function () {
            console.info("[Fetch] Adding requests to cache.");
          })
          .catch(function(err) {
            console.warn(event.request.url + ': ' + err.message);
          });
        });

        return response;
      });
    })
  );
});
