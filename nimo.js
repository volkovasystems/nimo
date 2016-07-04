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

	view.setAttribute( "name", name );
	view.classList.add( name );

	nimo.data.index = nimo.data.index || 0;
	view.setAttribute( "index", nimo.data.index );
	nimo.view[ nimo.data.index ] = view;
	nimo.data.index++;

	view.setAttribute( "style", [
		"display: flex;",

		"position: absolute",

		"width: 100vw;",
		"height: 100vh;",

		"border: 0;",
		"padding: 0px;",
		"margin: 0px;",
		"float: none;"
	].join( " " ) );

	view.classList.add( "hidden" );

	nimo.body.appendChild( view );

	nimo.view[ name ] = view;

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
				"position: absolute",
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
			"position: absolute",
			"top: 0px;",
			"left: 0px",

			"width: 100vw;",
			"height: 100vh;",

			"border: 0;",
			"padding: 0px;",
			"margin: 0px;",
			"float: none;"
		].join( " " ) );

		var style = document.createElement( "style" );
		style.appendChild( document.createTextNode( "" ) );
		document.head.appendChild( style );
		harden( "sheet", style.sheet, nimo );

		nimo.sheet.insertRule( ".hidden" + JSON.stringify( {
			"display": "none !important",
			"width": "0px !important",
			"height": "0px !important",
			"opacity": "hidden !important"
		} )
		.replace( /\,/g, ";" )
		.replace( /\"/g, "" ), 0 );

		harden( "BOOTED", "booted", nimo );
	}, nimo );

harden( "show",
	function show( name ){
		if( name in nimo.view ){
			var index = 0;
			while( nimo.view[ index ] ){
				nimo.view[ index ].classList.add( "hidden" );
				index++;
			}

			nimo.view[ name ].classList.remove( "hidden" );

		}else{
			console.debug( "cannot find view", name );
		}
	}, nimo );

harden( "hide",
	function hide( name ){
		if( name in nimo.view ){
			nimo.view[ name ].classList.add( "hidden" );

		}else{
			console.debug( "cannot find view", name );
		}
	}, nimo );
