"use strict";

/*:
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2016 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "nimo",
			"path": "nimo/nimo.js",
			"file": "nimo.js",
			"module": "nimo",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/nimo.git",
			"global": true,
			"class": true
		}
	@end-module-configuration

	@module-documentation:
		Views are the layout of what the user will see on the webpage.


	@end-module-documentation

	@include:
		{
			"harden": "harden"
		}
	@end-include
*/

if( typeof window != "undefined" &&
	!( "harden" in window ) )
{
	throw new Error( "harden is not defined" );
}

/*:
	@option:
		{
			"name:required": "string",
			"level": "number"
		}
	@end-option
*/
var nimo = function nimo( option ){
	/*:
		@meta-configuration:
			{
				"option:required": [
					"object",
					"string"
				]
			}
		@end-meta-configuration
	*/

	if( !nimo.BOOTED ){
		throw new Error( "nimo is not loaded properly" );
	}

	if( typeof option == "string" &&
		option in nimo.view )
	{
		return nimo.view[ option ];

	}else if( typeof option == "string" ){
		option = { "name": option };

	}else{
		option = option || { };
	}

	var name = option.name;
	if( !name ){
		throw new Error( "name not specified" );
	}

	var view = document.createElement( "section" );
	view.classList.add( "view" );

	view.setAttribute( "name", name );
	view.classList.add( name );

	nimo.data.index = nimo.data.index || 0;
	var index = nimo.data.index;
	view.setAttribute( "index", index );
	harden( index, view, nimo.view );
	nimo.data.index++;

	var level = option.level || index || 0;
	view.setAttribute( "level", level );
	view.style.zIndex = level;

	view.setAttribute( "style", [
		"display: flex;",
		"flex-direction: row;",

		"position: absolute;",

		"width: 100vw;",
		"height: 100vh;",

		"border: 0;",
		"padding: 0px;",
		"margin: 0px;",
		"float: none;"
	].join( " " ) );

	view.classList.add( "hidden" );

	nimo.body.appendChild( view );

	harden( name, view, nimo.view );

	return view;
};

harden( "data", nimo.data || { }, nimo );

/*:
	This will be the collection of views.
*/
harden( "view", nimo.view || { }, nimo );

harden( "boot",
	function boot( ){
		document.querySelector( "html" )
			.setAttribute( "style", [
				"display: flex;",
				"flex-direction: row;",

				"position: absolute;",
				"top: 0px;",
				"left: 0px",

				"width: 100vw;",
				"height: 100vh;",

				"border: 0;",
				"padding: 0px;",
				"margin: 0px;",
				"float: none;"
			].join( " " ) );

		harden( "body", document.querySelector( "body" ), nimo );
		nimo.body.setAttribute( "style", [
			"display: flex;",
			"flex-direction: row;",

			"position: absolute;",
			"top: 0px;",
			"left: 0px;",

			"width: 100vw;",
			"height: 100vh;",

			"border: 0;",
			"padding: 0px;",
			"margin: 0px;",
			"float: none;"
		].join( " " ) );

		if( !document.querySelector( "style.root" ) ){
			var style = document.createElement( "style" );

			style.setAttribute( "name", "root" );
			style.classList.add( "root" );
			style.appendChild( document.createTextNode( "" ) );
			document.head.appendChild( style );

			harden( "sheet", style.sheet, nimo );

		}else{
			var sheet = document.querySelector( "style.root" ).sheet;
			if( sheet ){
				harden( "sheet", sheet, nimo );

			}else{
				throw new Error( "cannot find root style" );
			}
		}

		try{
			nimo.sheet.insertRule( ".hidden" + JSON.stringify( {
				"display": "none !important",
				"width": "0px !important",
				"height": "0px !important",
				"opacity": "hidden !important"
			} )
			.replace( /\,/g, ";" )
			.replace( /\"/g, "" ), 0 );

			nimo.sheet.insertRule( "section.view" + JSON.stringify( {
				"display": "flex !important",
				"flex-direction": "row !important",

				"position": "absolute !important",

				"border": "0 !important",
				"padding": "0px !important",
				"margin": "0px !important",

				"float": "none !important"
			} )
			.replace( /\,/g, ";" )
			.replace( /\"/g, "" ), 0 );

		}catch( error ){
			console.debug( "unexpected error when inserting rule", error );
		}

		harden( "BOOTED", "booted", nimo );

		return nimo;
	}, nimo );

harden( "show",
	function show( name ){
		if( !name ){
			throw new Error( "name not specified" );
		}

		if( name in nimo.view ){
			var index = 0;
			while( nimo.view[ index ] ){
				nimo.view[ index ].classList.add( "hidden" );
				index++;
			}

			var view = nimo.view[ name ];
			view.classList.remove( "hidden" );

			var level = parseInt( view.getAttribute( "level" ) );
			view.style.zIndex = level;

		}else{
			console.debug( "cannot find view", name );
		}

		return nimo;
	}, nimo );

harden( "hide",
	function hide( name ){
		if( !name ){
			throw new Error( "name not specified" );
		}

		if( name in nimo.view ){
			nimo.view[ name ].classList.add( "hidden" );

		}else{
			console.debug( "cannot find view", name );
		}

		return nimo;
	}, nimo );

harden( "cascade",
	function cascade( ){
		Object.getOwnPropertyNames( nimo.view )
			.filter( function onEachKey( key ){
				return ( /^\d+$/ ).test( key.toString( ) );
			} )
			.forEach( function onEachIndex( index ){
				index = parseInt( index );

				var view = nimo.view[ index ];

				view.style.zIndex = index;
				view.setAttribute( "level", index );
			} );

		return nimo;
	}, nimo );
