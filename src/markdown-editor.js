// -------------------------------------------
// DEFAULT INPUT AND OUTPUT AREA
// -------------------------------------------
let textarea = document.querySelector( '#editor-content' );
let outputArea = document.querySelector( '#output' );

// -------------------------------------------
// TOOLBAR
// -------------------------------------------
export let preview = document.querySelector( '#preview' );
export const boldButton = document.querySelector( '#bold' );
export const italicButton = document.querySelector( '#italic' );
export const heading1Button = document.querySelector( '#heading1' );
export const heading2Button = document.querySelector( '#heading2' );
export const heading3Button = document.querySelector( '#heading3' );

preview.addEventListener( 'click', function() {
	const lines = textarea.value.split( '\n' )
		.map( function( line ) {
			return parse( line );
		} );
	output( lines.join( '' ) );

	outputArea.style.display === 'block' ?
	outputArea.style.display = 'none' :
	outputArea.style.display = 'block';

	preview.classList.toggle( 'active' );
} );

boldButton.addEventListener( 'click', function( ) {
	insertText( textarea, '****', 2 );
} );

italicButton.addEventListener( 'click', function( ) {
	insertText( textarea, '**', 1 );
} );

heading1Button.addEventListener( 'click', function() {
	insertText( textarea, '#', 1 );
} );

heading2Button.addEventListener( 'click', function() {
	insertText( textarea, '##', 2 );
} );

heading3Button.addEventListener( 'click', function() {
	insertText( textarea, '###', 3 );
} );

// -------------------------------------------

function setInputArea( inputElement ) {
	textarea = inputElement;
}

function setOutputArea( outputElement ) {
	outputArea = outputElement;
}

function insertText( textarea, text, finalCursorPosition ) {
	const selectionStart = textarea.selectionStart;
	const selectionEnd = textarea.selectionEnd;
	const currentText = textarea.value;

	if( selectionStart === selectionEnd ) {
		textarea.value = currentText.substring( 0, selectionStart ) + text + currentText.substring( selectionStart );

		textarea.focus();
		textarea.selectionEnd = selectionStart + finalCursorPosition;
	} else {
		const selectedText = currentText.substring( selectionStart, selectionEnd );
		const withoutSelection = currentText.substring( 0, selectionStart ) + currentText.substring( selectionEnd );
		const textWithSyntax = withoutSelection.substring( 0, selectionStart ) + text + withoutSelection.substring( selectionStart );

		textarea.value = textWithSyntax.substring( 0,selectionStart + finalCursorPosition ) + selectedText + textWithSyntax.substring( selectionStart + finalCursorPosition );

		textarea.focus();
		textarea.selectionEnd = selectionStart + finalCursorPosition + selectedText.length;
	}
}

function output( lines ) {
	outputArea.innerHTML = lines;
}

function parse( line ) {
	// Regular Expressions
	const h1 = /^#{1}[^#]/;
	const h2 = /^#{2}[^#]/;
	const h3 = /^#{3}[^#]/;
	const bold = /\*\*[^*]+\*\*/g;
	const italics = /[^\*]?\*\w[\w|\s]*\w\*/g;
	const paragraph = /^[^#]/;
	const link = /\[(.)*\]\((.)*\)/g;
	const unorderedList = /^[\*|\-|\+]\s/;

	line.trim();

	// Example: # Heading 1
	if( h1.test( line ) ) {
		line = '<h1>' + line.slice( 1 ) + '</h1>';
	}

	// Example: ## Heading 2
	if( h2.test( line ) ) {
		line = '<h2>' + line.slice( 2 ) + '</h2>';
	}

	// Example: ### Heading 3
	if( h3.test( line ) ) {
		line = '<h3>' + line.slice( 3 ) + '</h3>';
	}

	// Paragraphs
	if( paragraph.test( line ) ) {
		line = '<p>' + line + '</p>';
	}

	// Example: **Strong**
	if( bold.test( line ) ) {
		const matches = line.match( bold ) ;

		matches.forEach( function( element ) {
			const formattedElement = '<strong>' + element.slice( 2, -2 ) + '</strong>';

			line = line.replace( element, formattedElement );
		} );
	}

	// Example: *Italics*
	// Since lookbehind is not allowed in JavaScript for regular expressions
	// the regexp matches a character behind if is not an asterisk, so a slice
	// starting from two will do the trick
	if( italics.test( line ) ) {

		console.log( line );

		const matches = line.match( italics );


		console.log( matches );

		matches.forEach( function( element ) {
			let formattedElement = '';

			if( element.charAt( 0 ) === '*' ) {
				formattedElement = '<em>' + element.slice( 1, -1 ) + '</em>';
			} else {
				formattedElement = element.slice( 0,1 ) + '<em>' + element.slice( 2, -1 ) + '</em>';
			}

			line = line.replace( element, formattedElement );
		} );
	}

	// Example: [I'm an inline-style link](https://www.google.com)
	if( link.test( line ) ) {
		const links = line.match( link );

		links.forEach( function( element ) {
			const text = line.match( /^\[[\w|\s]+\]/ )[ 0 ].slice( 1, -1 );
			const url = line.match( /\((.)+\)/ )[ 0 ].slice( 1, -1 );

			line.replace( element, '<a href="' + url + '">' + text + '</a>' );
		} );
	}

	return line + '\n';
}

export { setInputArea, setOutputArea, parse };